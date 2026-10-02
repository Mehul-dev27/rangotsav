import './globals.css'
import Header from '@/components/Header'
export const metadata = { title: 'Rangotsav — Kurtis, Chaniya Choli, Sarees & Dress Materials', description: 'Authentic colors. Premium ethnic wear.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><div className="bg-maroon py-2 text-center text-xs text-cream">Free shipping above ₹999 · Easy returns · Cash on Delivery available</div><Header />{children}
    <footer className="mt-20 border-t border-sand py-8 text-center text-xs text-ink/60">© Rangotsav</footer></body></html>
}
