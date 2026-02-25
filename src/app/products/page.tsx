// src/app/products/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsPageContent from './ProductsPageContent'
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton'

export const revalidate = 60

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ product_type?: string; category?: string; subcategory?: string; search?: string }> | { product_type?: string; category?: string; subcategory?: string; search?: string }
}): Promise<Metadata> {
  const params = await Promise.resolve(searchParams)

  let title = 'All Products – Office Supplies & Equipment Dubai'
  let description = 'Browse our full range of office supplies, furniture and equipment in Dubai, UAE. New, refurbished and rental options available.'

  if (params?.product_type === 'new') {
    title = 'New Office Supplies & Equipment Dubai'
    description = 'Shop brand new office supplies, furniture and equipment in Dubai, UAE.'
  } else if (params?.product_type === 'refurbished') {
    title = 'Refurbished Office Equipment Dubai – Quality at Great Prices'
    description = 'Buy refurbished office furniture and equipment in Dubai, UAE.'
  } else if (params?.product_type === 'rental') {
    title = 'Office Equipment Rental Dubai – Flexible Rental Plans'
    description = 'Rent office equipment and furniture in Dubai, UAE.'
  } else if (params?.subcategory) {
    title = `${params.subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} – Office Supplies Dubai`
    description = `Shop ${params.subcategory.replace(/-/g, ' ')} in Dubai, UAE at KhaizanSolutions.`
  } else if (params?.category) {
    title = `${params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} – Office Supplies Dubai`
    description = `Shop ${params.category.replace(/-/g, ' ')} in Dubai, UAE at KhaizanSolutions.`
  } else if (params?.search) {
    title = `Search results for "${params.search}" – KhaizanSolutions`
    description = `Find ${params.search} at KhaizanSolutions Dubai.`
  }

  return {
    title,
    description,
    alternates: { canonical: '/products' },
    openGraph: {
      title,
      description,
      url: 'https://www.khaizansolution.com/products',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

// Fetch products with reasonable limit (not 1000 - that kills Render)
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products/?page_size=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { results: [], count: 0 }
    return res.json()
  } catch {
    return { results: [], count: 0 }
  }
}

// Fetch ALL categories including subcategories
async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories/`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : data.results || []
  } catch {
    return []
  }
}

async function ProductsData({
  productType,
  category,
  subcategory,
  search,
}: {
  productType?: string | null
  category?: string | null
  subcategory?: string | null
  search?: string | null
}) {
  const [productsData, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ])

  const allProducts = productsData?.results || []
  const totalCount = productsData?.count || allProducts.length

  return (
    <ProductsPageContent
      initialProducts={allProducts}
      initialCategories={categories}
      totalCount={totalCount}
      initialProductType={productType || null}
      initialCategory={category || null}
      initialSubcategory={subcategory || null}
      initialSearch={search || null}
    />
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ product_type?: string; category?: string; subcategory?: string; search?: string }> | { product_type?: string; category?: string; subcategory?: string; search?: string }
}) {
  const resolvedParams = await Promise.resolve(searchParams)

  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsData
        productType={resolvedParams?.product_type}
        category={resolvedParams?.category}
        subcategory={resolvedParams?.subcategory}
        search={resolvedParams?.search}
      />
    </Suspense>
  )
}

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-5">
        <div className="mb-5">
          <div className="h-7 bg-gray-200 rounded-lg w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
        </div>
        <div className="flex gap-4">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-7 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}