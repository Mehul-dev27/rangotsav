import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
export const dynamic = 'force-dynamic'
export default async function Home() {
  const sb = supabaseServer()
  const [{ data: banners }, { data: cats }, { data: feat }] = await Promise.all([
    sb.from('banners').select('*').eq('is_active', true).order('sort_order').limit(1),
    sb.from('categories').select('*').is('parent_id', null).order('sort_order'),
    sb.from('products').select('id,name,slug,price,discount_price,product_images(url,is_primary)').eq('is_active', true).order('popularity', { ascending: false }).limit(8),
  ])
  const b = banners?.[0]
  return (<main>
    <section className="relative flex h-[60vh] items-center justify-center bg-sand bg-cover bg-center text-center" style={b ? { backgroundImage: `url(${b.image_url})` } : {}}>
      <div className="bg-cream/80 px-8 py-6"><h1 className="font-serif text-4xl">{b?.title ?? 'Festive Collection'}</h1><p className="mt-2">{b?.subtitle ?? 'Navratri · Festive · Casual Kurtis'}</p>
        <Link href={b?.link_url ?? '/shop'} className="btn-dark mt-4">Shop Now</Link></div></section>
    <section className="mx-auto max-w-6xl px-4 py-12"><h2 className="mb-6 font-serif text-2xl">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{cats?.map((c) => <Link key={c.id} href={`/shop?category=${c.slug}`} className="relative block aspect-square overflow-hidden bg-sand"><img src={c.image_url ?? ''} className="h-full w-full object-cover" /><span className="absolute inset-x-0 bottom-0 bg-cream/90 py-2 text-center text-sm">{c.name}</span></Link>)}</div></section>
    <section className="mx-auto max-w-6xl px-4"><h2 className="mb-6 font-serif text-2xl">Trending Now</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{feat?.map((p) => <ProductCard key={p.id} p={p} />)}</div></section>
    <section className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 text-center text-sm md:grid-cols-3">{['Fast Shipping','Easy Returns','100% Authentic Colors'].map((t) => <div key={t} className="bg-sand py-6 font-medium">{t}</div>)}</section>
  </main>)
}
