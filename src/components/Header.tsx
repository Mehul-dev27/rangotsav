'use client'
import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useEffect, useState } from 'react'
export default function Header() {
  const items = useCart((s) => s.items); const [m, setM] = useState(false); useEffect(() => setM(true), [])
  const n = m ? items.reduce((a, b) => a + b.qty, 0) : 0
  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-xl tracking-wide text-maroon">Rangotsav</Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {[['Kurtis','kurtis'],['Chaniya Choli','chaniya-choli'],['Sarees','sarees'],['Dress Materials','dress-materials']].map(([l, s]) => <Link key={s} href={`/shop?category=${s}`} className="hover:text-maroon">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-4"><Link href="/login"><User size={20} /></Link>
          <Link href="/cart" className="relative"><ShoppingBag size={20} />{n > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-maroon px-1.5 text-[10px] text-white">{n}</span>}</Link></div>
      </div>
    </header>
  )
}
