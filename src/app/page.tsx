// src/app/page.tsx
import type { Metadata } from 'next'
import HeroSlider from '@/components/home/HeroSlider'
import ProductTypeCards from '@/components/home/ProductTypeCards'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export const metadata: Metadata = {
  title: 'Office Supplies, Furniture & Equipment Dubai | Khaizan Solutions',
  description:
    'Shop new, refurbished & rental office supplies, furniture, and equipment in Dubai, UAE. Browse our full range and request a free quote today.',
  alternates: { canonical: '/' },
}

// ✅ PERF FIX: Fetch both in parallel server-side — instant load, no client spinner
async function getHomeData() {
  const [categoriesRes, featuredRes] = await Promise.all([
    fetch(`${API_URL}/categories/?navbar=true`, { next: { revalidate: 1800 } }),
    fetch(`${API_URL}/products/featured/`, { next: { revalidate: 300 } }),
  ])

  const categoriesData = categoriesRes.ok ? await categoriesRes.json() : []
  const featuredData = featuredRes.ok ? await featuredRes.json() : []

  const categories = categoriesData.results || categoriesData || []
  const featured = Array.isArray(featuredData) ? featuredData : featuredData.results || []

  return { categories, featured }
}

export default async function Home() {
  const { categories, featured } = await getHomeData()

  return (
    <div>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Product Type Cards */}
      <ProductTypeCards />

      {/* 3. Category Grid — server data, no loading spinner */}
      <CategoryGrid initialCategories={categories} />

      {/* 4. Featured Products — server data, no loading spinner */}
      <FeaturedProducts initialProducts={featured} />
    </div>
  )
}