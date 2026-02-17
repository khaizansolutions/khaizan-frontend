// src/app/products/page.tsx
import { Suspense } from 'react'
import { api } from '@/lib/api'
import ProductsPageContent from './ProductsPageContent'
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton'

export const dynamic = 'force-dynamic'

async function fetchAllProducts() {
  const allProducts: any[] = []
  let currentPage = 1
  let hasMore = true

  while (hasMore) {
    const data = await api.getProducts({ page: currentPage })
    if (data && data.results && data.results.length > 0) {
      allProducts.push(...data.results)
      hasMore = data.next !== null
      currentPage++
    } else {
      hasMore = false
    }
  }

  return allProducts
}

// ⭐ searchParams must be typed as a Promise in Next.js 15+
// OR as a plain object in Next.js 13/14
// This handles BOTH versions safely
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ product_type?: string; category?: string; search?: string }> | { product_type?: string; category?: string; search?: string }
}) {
  // ⭐ Await searchParams (required in Next.js 15+)
  const resolvedParams = await Promise.resolve(searchParams)

  console.log('🔍 URL Params received:', resolvedParams)

  const [allProducts, categoriesData] = await Promise.all([
    fetchAllProducts(),
    api.getCategories(),
  ])

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  console.log('🎯 product_type from URL:', resolvedParams?.product_type)

  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent
        initialProducts={allProducts}
        initialCategories={categories}
        totalCount={allProducts.length}
        initialProductType={resolvedParams?.product_type || null}
        initialCategory={resolvedParams?.category || null}
        initialSearch={resolvedParams?.search || null}
      />
    </Suspense>
  )
}

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 mb-3 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-96 animate-pulse" />
        </div>
        <div className="flex gap-8">
          <aside className="hidden md:block w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
              <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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