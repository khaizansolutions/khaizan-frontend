import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { QuoteProvider } from '@/context/QuoteContext'
import WakeBackend from '@/components/common/WakeBackend'
import SchemaMarkup from '@/components/seo/SchemaMarkup'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

async function getNavCategories() {
  try {
    const res = await fetch(`${API_URL}/categories/?navbar=true`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.results || data || []
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.khaizansolution.com'),
  title: {
    default: 'Khaizan Solutions – Office Supplies, Furniture & Equipment Dubai',
    template: '%s | Khaizan Solutions',
  },
  description:
    'Khaizan Solutions is your trusted partner for new, refurbished & rental office supplies, furniture, and equipment in Dubai, UAE. Get a free quote today.',
  keywords: [
    'office supplies Dubai',
    'office furniture UAE',
    'office equipment Dubai',
    'refurbished office furniture',
    'office rental Dubai',
    'Khaizan Solutions',
    'office supplies UAE',
  ],
  verification: {
    google: 'aBk4_ofvvAy13uytHfSFycsm8S2slCnYk33hSdhHTXs',
  },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.khaizansolution.com',
    siteName: 'Khaizan Solutions',
    title: 'Khaizan Solutions – Office Supplies, Furniture & Equipment Dubai',
    description:
      'Your trusted partner for new, refurbished & rental office supplies, furniture, and equipment in Dubai, UAE.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Khaizan Solutions – Office Supplies Dubai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khaizan Solutions – Office Supplies, Furniture & Equipment Dubai',
    description: 'Your trusted partner for new, refurbished & rental office supplies, furniture, and equipment in Dubai, UAE.',
    images: ['/og-image.jpg'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getNavCategories()

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <SchemaMarkup />
        <QuoteProvider>
          <WakeBackend />
          <Header />
          <Navbar initialCategories={categories} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </QuoteProvider>
      </body>
    </html>
  )
}