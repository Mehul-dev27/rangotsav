import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export type CartItem = { variantId: string; productId: string; slug: string; name: string; image: string; color: string; size: string; price: number; qty: number; notes?: string }
type S = { items: CartItem[]; add: (i: CartItem) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void }
export const useCart = create<S>()(persist((set) => ({
  items: [],
  add: (i) => set((s) => { const ex = s.items.find((x) => x.variantId === i.variantId); return { items: ex ? s.items.map((x) => x.variantId === i.variantId ? { ...x, qty: x.qty + i.qty } : x) : [...s.items, i] } }),
  setQty: (id, q) => set((s) => ({ items: s.items.map((x) => x.variantId === id ? { ...x, qty: Math.max(1, q) } : x) })),
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.variantId !== id) })),
  clear: () => set({ items: [] }),
}), { name: 'cart' }))
