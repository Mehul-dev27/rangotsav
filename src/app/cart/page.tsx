'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { inr, FREE_SHIP_ABOVE, SHIP_FEE } from '@/lib/utils'
export default function Cart() {
  const { items, setQty, remove } = useCart()
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0); const ship = sub === 0 || sub >= FREE_SHIP_ABOVE ? 0 : SHIP_FEE
  if (!items.length) return <p className="py-32 text-center">Your cart is empty. <Link href="/shop" className="underline">Keep shopping</Link></p>
  return (<main className="mx-auto max-w-3xl px-4 py-8"><h1 className="mb-6 font-serif text-2xl">Your Cart</h1>
    {items.map((i) => <div key={i.variantId} className="flex gap-4 border-b border-sand py-4"><img src={i.image} className="h-28 w-20 object-cover" />
      <div className="flex-1 text-sm"><Link href={`/product/${i.slug}`} className="font-medium">{i.name}</Link><p>{i.color} · {i.size}</p>{i.notes && <p className="text-ink/60">Note: {i.notes}</p>}
        <div className="mt-2 flex items-center gap-3"><button onClick={() => setQty(i.variantId, i.qty - 1)}>−</button>{i.qty}<button onClick={() => setQty(i.variantId, i.qty + 1)}>+</button><button onClick={() => remove(i.variantId)} className="ml-4 text-maroon underline">Remove</button></div></div>
      <p className="text-sm">{inr(i.price * i.qty)}</p></div>)}
    <div className="mt-6 space-y-1 text-sm"><p className="flex justify-between">Subtotal<span>{inr(sub)}</span></p><p className="flex justify-between">Shipping<span>{ship ? inr(ship) : 'Free'}</span></p><p className="flex justify-between text-base font-medium">Total<span>{inr(sub + ship)}</span></p></div>
    <Link href="/checkout" className="btn-dark mt-6 w-full">Proceed to Checkout</Link></main>)
}
