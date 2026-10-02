import Link from 'next/link'
export default function Success({ searchParams }: { searchParams: { n?: string } }) {
  return <main className="py-32 text-center"><h1 className="font-serif text-3xl">Thank you! 🎉</h1><p className="mt-2">Order <b>{searchParams.n}</b> is confirmed.</p><Link href="/shop" className="btn-dark mt-6">Continue Shopping</Link></main>
}
