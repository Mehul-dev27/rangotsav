import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
export async function POST(req: Request) {
  const body = await req.text(); const sig = req.headers.get('x-razorpay-signature') ?? ''
  const exp = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!).update(body).digest('hex')
  if (exp !== sig) return NextResponse.json({ error: 'Bad signature' }, { status: 400 })
  const ev = JSON.parse(body); const pay = ev.payload?.payment?.entity; const db = supabaseAdmin()
  if (ev.event === 'payment.captured') await db.from('orders').update({ payment_status: 'paid', status: 'paid', razorpay_payment_id: pay.id }).eq('razorpay_order_id', pay.order_id)
  if (ev.event === 'payment.failed') await db.from('orders').update({ payment_status: 'failed' }).eq('razorpay_order_id', pay.order_id)
  return NextResponse.json({ ok: true })
}
