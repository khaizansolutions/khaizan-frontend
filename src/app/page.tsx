// src/app/page.tsx
import type { Metadata } from 'next'
import HeroSlider from '@/components/home/HeroSlider'
import ProductTypeCards from '@/components/home/ProductTypeCards'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TrustBar from '@/components/home/TrustBar'
import WhyChooseUs from '@/components/home/WhyChooseUs'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export const metadata: Metadata = {
  title: 'Office Supplies Dubai | Furniture, Printer Rental & Refurbished Equipment UAE | Khaizan Solutions',
  description:
    'Khaizan Solutions — Dubai\'s trusted supplier of office supplies, furniture & equipment. New, refurbished & rental options. Printers, copiers, chairs, desks, stationery & more. Serving Dubai, Abu Dhabi, Sharjah, UAE. Free delivery over AED 300. Get a free quote today!',
  keywords: [
    'office supplies Dubai', 'office furniture Dubai', 'office equipment Dubai', 'office supplies UAE', 'office furniture UAE',
    'printer rental Dubai', 'copier rental Dubai', 'office furniture rental Dubai', 'office equipment rental Dubai',
    'office chair rental Dubai', 'laptop rental Dubai', 'projector rental Dubai', 'office rental Abu Dhabi', 'office rental Sharjah',
    'refurbished office furniture Dubai', 'refurbished printers Dubai', 'refurbished office chairs Dubai',
    'second hand office furniture Dubai', 'used office equipment UAE', 'refurbished copiers Dubai',
    'office chairs Dubai', 'office desks Dubai', 'filing cabinets Dubai', 'office stationery Dubai',
    'ink cartridges Dubai', 'toner cartridges Dubai', 'paper products Dubai', 'shredders Dubai', 'whiteboards Dubai', 'office storage Dubai',
    'office supplies Abu Dhabi', 'office supplies Sharjah', 'office furniture Abu Dhabi', 'office furniture Sharjah',
    'office equipment Abu Dhabi', 'stationery shop Dubai', 'office shop UAE',
    'Khaizan Solutions', 'Khaizan office supplies', 'khaizansolution.com',
  ],
  alternates: { canonical: 'https://www.khaizansolution.com' },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.khaizansolution.com',
    siteName: 'Khaizan Solutions',
    title: 'Office Supplies, Furniture & Equipment Dubai | Khaizan Solutions',
    description: 'New, refurbished & rental office supplies, furniture, printers and equipment in Dubai, Abu Dhabi, Sharjah, UAE. Free delivery over AED 300.',
    images: [{ url: 'https://www.khaizansolution.com/og-image.jpg', width: 1200, height: 630, alt: 'Khaizan Solutions — Office Supplies Dubai UAE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Supplies, Furniture & Equipment Dubai | Khaizan Solutions',
    description: 'New, refurbished & rental office supplies and furniture in Dubai, Abu Dhabi, Sharjah UAE.',
    images: ['https://www.khaizansolution.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
}

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
      <h1 className="sr-only">
        Khaizan Solutions — Office Supplies, Furniture & Equipment Dubai UAE.
        New, Refurbished & Rental options. Serving Dubai, Abu Dhabi, Sharjah and all UAE.
      </h1>

      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Trust Bar ← new */}
      <TrustBar />

      {/* 3. Product Type Cards */}
      <ProductTypeCards />

      {/* 4. Category Grid */}
      <CategoryGrid initialCategories={categories} />

      {/* 5. Featured Products */}
      <FeaturedProducts initialProducts={featured} />

      {/* 6. Why Choose Us ← new */}
      <WhyChooseUs />

      <section className="sr-only" aria-label="About Khaizan Solutions">
        <h2>Office Supplies Dubai</h2>
        <p>Khaizan Solutions is Dubai's trusted supplier of office supplies, stationery, furniture and equipment. We serve businesses across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah and all UAE with fast delivery and competitive prices.</p>
        <h2>Office Furniture Rental Dubai</h2>
        <p>Looking for office furniture rental in Dubai? Khaizan Solutions offers flexible short and long term rental plans for office chairs, desks, workstations, printers, copiers, laptops and display screens across Dubai, Abu Dhabi and Sharjah.</p>
        <h2>Refurbished Office Equipment Dubai</h2>
        <p>Buy quality refurbished office furniture, printers, copiers and equipment in Dubai at great prices. All refurbished products are tested and come with warranty. Available for delivery across UAE.</p>
        <h2>Printer Rental Dubai</h2>
        <p>Khaizan Solutions offers printer and copier rental in Dubai, Abu Dhabi and Sharjah with flexible monthly plans. Ideal for offices, events and short term projects.</p>
        <h2>Office Supplies Abu Dhabi and Sharjah</h2>
        <p>We deliver office supplies, furniture and equipment to Abu Dhabi, Sharjah, Ajman and all UAE emirates. Free delivery on orders over AED 300.</p>
      </section>
    </div>
  )
}