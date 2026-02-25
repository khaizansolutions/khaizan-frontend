'use client'

import Link from 'next/link'
import { ArrowRight, Grid3X3 } from 'lucide-react'

interface Subcategory {
  id: number
  name: string
  slug: string
}

interface Category {
  id: number
  name: string
  slug: string
  navbar_order: number
  subcategories: Subcategory[]
}

interface CategoryGridProps {
  initialCategories?: Category[]
}

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const displayCategories = initialCategories.slice(0, 4)

  if (initialCategories.length === 0) {
    return (
      <section className="px-3 sm:px-4 py-4">
        <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 sm:px-4 py-4">
      <h2 className="text-base font-bold text-gray-800 mb-3">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group bg-gray-50 border border-gray-100 hover:border-primary rounded-xl p-3 hover:shadow-sm transition-all duration-200"
          >
            <h3 className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-1 mb-0.5">
              {category.name}
            </h3>
            {category.subcategories?.length > 0 && (
              <p className="text-[9px] text-gray-400 mb-1.5">
                {category.subcategories.length} subcategories
              </p>
            )}
            <div className="flex items-center gap-0.5 text-[9px] font-semibold text-primary">
              Browse <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {initialCategories.length > 4 && (
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
        >
          <Grid3X3 size={13} />
          View all {initialCategories.length} categories
          <ArrowRight size={11} />
        </Link>
      )}
    </section>
  )
}