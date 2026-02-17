import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { QuoteProvider } from '@/context/QuoteContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Office Supplies Store',
  description: 'Your one-stop shop for all office supplies',
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

// ⭐ Fetch categories on server with 10 min cache
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
  // ⭐ Categories ready before page renders
  const categories = await getNavCategories()

  return (
    <html lang="en">
      <body className={inter.className}>
        <QuoteProvider>
          <Header />
          <Navbar initialCategories={categories} />  {/* ⭐ No more loading delay */}
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </QuoteProvider>
      </body>
    </html>
  )
}