import Link from 'next/link'
import { inr, primaryImg } from '@/lib/utils'
export default function ProductCard({ p }: { p: any }) {
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-sand"><img src={primaryImg(p.product_images)} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      <h3 className="mt-3 text-sm">{p.name}</h3>
      <p className="text-sm">{p.discount_price ? <><span className="font-medium">{inr(p.discount_price)}</span> <s className="text-ink/50">{inr(p.price)}</s></> : <span className="font-medium">{inr(p.price)}</span>}</p>
    </Link>
  )
}
