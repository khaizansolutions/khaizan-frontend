// src/app/refurbished/page.tsx
// ✅ Dedicated page for refurbished — ranks for "refurbished office furniture Dubai" etc.
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Refurbished Office Furniture & Equipment Dubai | Second Hand Office Supplies UAE | Khaizan Solutions',
  description:
    'Buy quality refurbished office furniture, chairs, desks, printers & copiers in Dubai, Abu Dhabi & Sharjah. All tested with warranty. Best prices on second hand office equipment across UAE. Call +971507262269.',
  keywords: [
    'refurbished office furniture Dubai',
    'refurbished office chairs Dubai',
    'refurbished printers Dubai',
    'refurbished copiers Dubai',
    'second hand office furniture Dubai',
    'used office equipment Dubai',
    'refurbished office desks Dubai',
    'second hand office chairs UAE',
    'refurbished laptops Dubai',
    'used office furniture Abu Dhabi',
    'refurbished office equipment Sharjah',
    'cheap office furniture Dubai',
    'affordable office furniture UAE',
  ],
  alternates: { canonical: 'https://www.khaizansolution.com/refurbished' },
  openGraph: {
    title: 'Refurbished Office Furniture & Equipment Dubai | Khaizan Solutions',
    description: 'Quality refurbished office chairs, desks, printers & more at great prices. Serving Dubai, Abu Dhabi & Sharjah UAE.',
    url: 'https://www.khaizansolution.com/refurbished',
    images: [{ url: 'https://www.khaizansolution.com/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RefurbishedPage() {
  // Redirect to products page filtered by refurbished
  redirect('/products?product_type=refurbished')
}