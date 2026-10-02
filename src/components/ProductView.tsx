'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { inr } from '@/lib/utils'
export default function ProductView({ p }: { p: any }) {
  const router = useRouter(); const add = useCart((s) => s.add)
  const imgs = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)
  const colors: { name: string; hex: string }[] = useMemo(() => Object.values(Object.fromEntries(p.variants.map((v: any) => [v.color_name, { name: v.color_name, hex: v.color_hex }]))), [p])
  const [color, setColor] = useState(colors[0]?.name); const [size, setSize] = useState<string>()
  const [img, setImg] = useState(imgs.find((i: any) => i.is_primary)?.url ?? imgs[0]?.url); const [zoom, setZoom] = useState<string>()
  const [notes, setNotes] = useState(''); const [err, setErr] = useState('')
  const sizes = p.variants.filter((v: any) => v.color_name === color)
  const variant = sizes.find((v: any) => v.size === size); const price = p.discount_price ?? p.price
  const pickColor = (c: string) => { setColor(c); setSize(undefined); const ci = imgs.find((i: any) => i.color_name === c); if (ci) setImg(ci.url) }
  const go = (buy: boolean) => {
    if (!variant) return setErr('Please select a size')
    add({ variantId: variant.id, productId: p.id, slug: p.slug, name: p.name, image: img, color, size: variant.size, price, qty: 1, notes })
    router.push(buy ? '/checkout' : '/cart')
  }
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 pb-28 md:grid-cols-2">
      <div className="flex gap-3">
        <div className="flex w-16 flex-col gap-2">{imgs.map((i: any) => <img key={i.id} src={i.url} onClick={() => setImg(i.url)} className={`aspect-square cursor-pointer object-cover ${img === i.url ? 'ring-2 ring-maroon' : ''}`} />)}</div>
        <div className="aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden bg-sand" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`) }} onMouseLeave={() => setZoom(undefined)}>
          <img src={img} className="h-full w-full object-cover transition-transform duration-200" style={zoom ? { transform: 'scale(2)', transformOrigin: zoom } : {}} /></div>
      </div>
      <div>
        <h1 className="font-serif text-3xl">{p.name}</h1>
        <p className="mt-2 text-xl">{inr(price)} {p.discount_price && <s className="text-base text-ink/50">{inr(p.price)}</s>}</p>
        <p className="mt-2 inline-block bg-sand px-3 py-1 text-xs">✓ True-Color Guarantee — photographed in natural light</p>
        <div className="mt-6"><p className="mb-2 text-sm">Color: <b>{color}</b></p>
          <div className="flex gap-2">{colors.map((c) => <button key={c.name} onClick={() => pickColor(c.name)} title={c.name} style={{ background: c.hex }} className={`h-9 w-9 rounded-full border ${color === c.name ? 'ring-2 ring-offset-2 ring-ink' : ''}`} />)}</div></div>
        <div className="mt-6"><p className="mb-2 text-sm">Size</p>
          <div className="flex flex-wrap gap-2">{sizes.map((v: any) => <button key={v.id} disabled={v.stock === 0} onClick={() => { setSize(v.size); setErr('') }} className={`min-w-12 border px-3 py-2 text-sm ${size === v.size ? 'bg-ink text-cream' : ''} disabled:text-ink/30 disabled:line-through`}>{v.size}</button>)}</div>
          {variant && variant.stock <= 3 && variant.stock > 0 && <p className="mt-2 text-sm text-maroon">Only {variant.stock} left in size {variant.size}</p>}
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}</div>
        {p.allow_custom_stitching && <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Custom stitching / alteration notes (e.g. bust 36, length 40)" className="inp mt-6" rows={3} />}
        <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-sand bg-cream p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
          <button onClick={() => go(false)} className="btn-line flex-1">Add to Cart</button><button onClick={() => go(true)} className="btn-dark flex-1">Buy Now</button></div>
        <div className="mt-8 space-y-3 text-sm text-ink/80"><p>{p.description}</p>
          {p.fabric && <p><b>Fabric:</b> {p.fabric}</p>}{p.work_type && <p><b>Work:</b> {p.work_type}</p>}{p.care_instructions && <p><b>Care:</b> {p.care_instructions}</p>}</div>
      </div>
    </div>
  )
}
