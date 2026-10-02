'use client'
import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { inr, FREE_SHIP_ABOVE, SHIP_FEE } from '@/lib/utils'
const F = [['full_name','Full name'],['phone','Mobile number'],['house_no','House / Flat No'],['street','Street / Area'],['landmark','Landmark (optional)'],['city','City'],['state','State'],['pincode','Pincode']]
export default function Checkout() {
  const router = useRouter(); const { items, clear } = useCart()
  const [a, setA] = useState<any>({}); const [method, setMethod] = useState<'razorpay' | 'cod'>('razorpay'); const [coupon, setCoupon] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const sub = items.reduce((x, i) => x + i.price * i.qty, 0); const ship = sub >= FREE_SHIP_ABOVE ? 0 : SHIP_FEE
  const done = (n: string) => { clear(); router.push(`/order-success?n=${n}`) }
  async function pay() {
    setErr('')
    if (F.some(([k]) => k !== 'landmark' && !a[k])) return setErr('Please fill all address fields')
    setBusy(true)
    const r = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((i) => ({ variantId: i.variantId, qty: i.qty, notes: i.notes })), address: a, method, coupon }) })
    const d = await r.json(); if (!r.ok) { setBusy(false); return setErr(d.error) }
    if (method === 'cod') return done(d.orderNumber)
    const rz = new (window as any).Razorpay({ key: d.key, amount: d.amount, currency: 'INR', order_id: d.razorpayOrderId, name: 'Rangotsav', prefill: { name: a.full_name, contact: a.phone },
      handler: async (res: any) => { const v = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res) }); v.ok ? done(d.orderNumber) : setErr('Payment verification failed. Contact support.'); setBusy(false) },
      modal: { ondismiss: () => setBusy(false) } })
    rz.open()
  }
  if (!items.length) return <p className="py-32 text-center">Your cart is empty.</p>
  return (<main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-2"><Script src="https://checkout.razorpay.com/v1/checkout.js" />
    <div><h2 className="mb-4 font-serif text-xl">Delivery Address</h2><div className="grid gap-3">{F.map(([k, l]) => <input key={k} placeholder={l} className="inp" value={a[k] ?? ''} onChange={(e) => setA({ ...a, [k]: e.target.value })} />)}</div></div>
    <div><h2 className="mb-4 font-serif text-xl">Order Summary</h2>
      {items.map((i) => <p key={i.variantId} className="flex justify-between text-sm">{i.name} ({i.size}) × {i.qty}<span>{inr(i.price * i.qty)}</span></p>)}
      <input placeholder="Promo code" className="inp mt-4" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
      <div className="mt-4 space-y-1 border-t border-sand pt-4 text-sm"><p className="flex justify-between">Subtotal<span>{inr(sub)}</span></p><p className="flex justify-between">Shipping<span>{ship ? inr(ship) : 'Free'}</span></p><p className="text-xs text-ink/60">Coupon discount applied at payment · prices include GST</p></div>
      <div className="mt-4 space-y-2 text-sm"><label className="flex gap-2"><input type="radio" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />UPI / Cards / Netbanking (Razorpay)</label><label className="flex gap-2"><input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} />Cash on Delivery</label></div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      <button onClick={pay} disabled={busy} className="btn-dark mt-4 w-full disabled:opacity-50">{busy ? 'Please wait…' : method === 'cod' ? 'Place Order' : 'Pay Now'}</button></div></main>)
}
