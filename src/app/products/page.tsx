export const dynamic = 'force-dynamic'

'use client'
import { Suspense } from 'react'
import ProductsPageContent from './ProductsPageContent'
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton'

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}

function ProductsPageFallback() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <div className="h-10 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-64 h-96 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
