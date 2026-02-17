import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { QuoteProvider } from '@/context/QuoteContext'
import WakeBackend from '@/components/common/WakeBackend'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Office Supplies Store',
  description: 'Your one-stop shop for all office supplies',
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

async function getNavCategories() {
  try {
    const res = await fetch(`${API_URL}/categories/?navbar=true`, {
      next: { revalidate: 600 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.results || data || []
  } catch {
    return []
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getNavCategories()

  return (
    <html lang="en">
      <body className={inter.className}>
        <QuoteProvider>
          <WakeBackend /> {/* ⭐ Wakes Render on every page load */}
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