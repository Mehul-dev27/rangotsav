export const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })
export const primaryImg = (imgs: any[] = []) => (imgs.find((i) => i.is_primary) ?? imgs[0])?.url ?? ''
export const FREE_SHIP_ABOVE = 99900, SHIP_FEE = 8000
