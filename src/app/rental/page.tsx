// src/app/rental/page.tsx
// ✅ Dedicated page for rental — ranks for "printer rental Dubai", "office rental UAE" etc.
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Office Equipment Rental Dubai | Printer, Furniture & Copier Rental UAE | Khaizan Solutions',
  description:
    'Rent office equipment in Dubai, Abu Dhabi & Sharjah. Flexible rental plans for printers, copiers, office chairs, desks, laptops & display screens. Short & long term rental across UAE. Call +971507262269.',
  keywords: [
    'printer rental Dubai',
    'copier rental Dubai',
    'office furniture rental Dubai',
    'office equipment rental Dubai',
    'office chair rental Dubai',
    'laptop rental Dubai',
    'projector rental Dubai',
    'display screen rental Dubai',
    'office rental Abu Dhabi',
    'office rental Sharjah',
    'furniture rental UAE',
    'short term office rental Dubai',
    'monthly office equipment rental Dubai',
  ],
  alternates: { canonical: 'https://www.khaizansolution.com/rental' },
  openGraph: {
    title: 'Office Equipment Rental Dubai | Khaizan Solutions',
    description: 'Flexible rental plans for printers, copiers, furniture & more across Dubai, Abu Dhabi & Sharjah UAE.',
    url: 'https://www.khaizansolution.com/rental',
    images: [{ url: 'https://www.khaizansolution.com/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RentalPage() {
  // Redirect to products page filtered by rental
  redirect('/products?product_type=rental')
}