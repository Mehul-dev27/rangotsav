import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
export async function POST(req: Request) {
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = await req.json()
  const exp = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET!).update(`${o}|${p}`).digest('hex')
  if (exp !== s) return NextResponse.json({ error: 'Bad signature' }, { status: 400 })
  await supabaseAdmin().from('orders').update({ payment_status: 'paid', status: 'paid', razorpay_payment_id: p }).eq('razorpay_order_id', o)
  return NextResponse.json({ ok: true })
}
