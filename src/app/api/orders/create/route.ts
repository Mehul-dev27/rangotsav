import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseServer } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FREE_SHIP_ABOVE, SHIP_FEE, primaryImg } from '@/lib/utils'
const err = (m: string, s = 400) => NextResponse.json({ error: m }, { status: s })
export async function POST(req: Request) {
  const { data: { user } } = await supabaseServer().auth.getUser(); if (!user) return err('Please sign in', 401)
  const { items, address, method, coupon } = await req.json()
  if (!items?.length || !['razorpay', 'cod'].includes(method)) return err('Invalid order')
  if (!/^[1-9][0-9]{5}$/.test(address?.pincode ?? '')) return err('Invalid pincode')
  const db = supabaseAdmin()
  const { data: vs } = await db.from('variants').select('id,size,color_name,stock,product_id,products(id,name,price,discount_price,is_active,product_images(url,is_primary))').in('id', items.map((i: any) => i.variantId))
  let subtotal = 0; const rows: any[] = []
  for (const it of items) {
    const v: any = vs?.find((x) => x.id === it.variantId); const qty = Math.max(1, Math.floor(it.qty))
    if (!v || !v.products.is_active || v.stock < qty) return err(`"${v?.products?.name ?? 'An item'}" is out of stock`)
    const unit = v.products.discount_price ?? v.products.price; subtotal += unit * qty
    rows.push({ variant_id: v.id, product_id: v.product_id, product_name: v.products.name, color_name: v.color_name, size: v.size, image_url: primaryImg(v.products.product_images), unit_price: unit, quantity: qty, custom_notes: it.notes || null })
  }
  let discount = 0, code: string | null = null, cp: any = null
  if (coupon) {
    const { data: c } = await db.from('coupons').select('*').eq('code', coupon).eq('is_active', true).maybeSingle()
    const ok = c && (!c.expires_at || new Date(c.expires_at) > new Date()) && subtotal >= c.min_order_amount && (!c.usage_limit || c.used_count < c.usage_limit)
    if (!ok) return err('Invalid or expired promo code')
    discount = c.discount_type === 'percent' ? Math.floor((subtotal * c.discount_value) / 100) : c.discount_value
    if (c.max_discount) discount = Math.min(discount, c.max_discount); discount = Math.min(discount, subtotal); code = c.code; cp = c
  }
  const shipping = subtotal - discount >= FREE_SHIP_ABOVE ? 0 : SHIP_FEE; const total = subtotal - discount + shipping
  const done: any[] = []  // reserve stock atomically; negative qty restores on rollback
  for (const r of rows) {
    const { data: ok } = await db.rpc('decrement_stock', { p_variant: r.variant_id, p_qty: r.quantity })
    if (!ok) { for (const d of done) await db.rpc('decrement_stock', { p_variant: d.variant_id, p_qty: -d.quantity }); return err(`"${r.product_name}" just sold out`) }
    done.push(r)
  }
  const { data: order, error } = await db.from('orders').insert({ user_id: user.id, payment_method: method, subtotal, discount, shipping_fee: shipping, total, coupon_code: code, shipping_address: address }).select().single()
  if (error) { for (const d of done) await db.rpc('decrement_stock', { p_variant: d.variant_id, p_qty: -d.quantity }); return err('Could not create order', 500) }
  await db.from('order_items').insert(rows.map((r) => ({ ...r, order_id: order.id })))
  if (cp) await db.from('coupons').update({ used_count: cp.used_count + 1 }).eq('code', cp.code)
  if (method === 'cod') return NextResponse.json({ orderNumber: order.order_number })
  const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_SECRET! })
  const ro = await rz.orders.create({ amount: total, currency: 'INR', receipt: order.order_number })
  await db.from('orders').update({ razorpay_order_id: ro.id }).eq('id', order.id)
  return NextResponse.json({ orderNumber: order.order_number, razorpayOrderId: ro.id, amount: total, key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID })
}
