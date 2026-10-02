import { supabaseServer } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
export const dynamic = 'force-dynamic'
export default async function Shop({ searchParams: q }: { searchParams: Record<string, string> }) {
  const sb = supabaseServer()
  let query = sb.from('products').select('id,name,slug,price,discount_price,created_at,popularity,product_images(url,is_primary)').eq('is_active', true)
  if (q.category) { const { data: c } = await sb.from('categories').select('id').eq('slug', q.category).single(); if (c) query = query.eq('category_id', c.id) }
  if (q.fabric) query = query.eq('fabric', q.fabric)
  if (q.occasion) query = query.contains('occasion', [q.occasion])
  if (q.max) query = query.lte('price', Number(q.max) * 100)
  const sort = q.sort ?? 'new'
  query = sort === 'low' ? query.order('price') : sort === 'high' ? query.order('price', { ascending: false }) : sort === 'pop' ? query.order('popularity', { ascending: false }) : query.order('created_at', { ascending: false })
  const { data } = await query
  const sel = 'inp !w-auto'
  return (<main className="mx-auto max-w-6xl px-4 py-8">
    <form className="mb-6 flex flex-wrap items-end gap-3">
      <input type="hidden" name="category" value={q.category ?? ''} />
      <select name="fabric" defaultValue={q.fabric ?? ''} className={sel}><option value="">All fabrics</option>{['Cotton','Silk','Georgette','Chiffon'].map((f) => <option key={f}>{f}</option>)}</select>
      <select name="occasion" defaultValue={q.occasion ?? ''} className={sel}><option value="">All occasions</option>{['navratri','festive','casual','wedding'].map((f) => <option key={f}>{f}</option>)}</select>
      <select name="max" defaultValue={q.max ?? ''} className={sel}><option value="">Any price</option>{[1000, 2000, 5000, 10000].map((n) => <option key={n} value={n}>Under ₹{n}</option>)}</select>
      <select name="sort" defaultValue={sort} className={sel}><option value="new">Newest</option><option value="pop">Popularity</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select>
      <button className="btn-dark !py-2">Apply</button></form>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    {!data?.length && <p className="py-20 text-center">No products found.</p>}
  </main>)
}
