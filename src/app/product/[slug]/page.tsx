import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'
import ProductView from '@/components/ProductView'
export default async function PDP({ params }: { params: { slug: string } }) {
  const { data } = await supabaseServer().from('products').select('*, product_images(*), variants(*)').eq('slug', params.slug).eq('is_active', true).single()
  if (!data) notFound()
  return <ProductView p={data} />
}
