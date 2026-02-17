'use client'

import { useState, useEffect } from 'react'
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

const COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100 hover:border-blue-300' },
  { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100 hover:border-green-300' },
  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100 hover:border-purple-300' },
  { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100 hover:border-orange-300' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/categories/?navbar=true`, { next: { revalidate: 60 } } as any)
      .then((r) => r.json())
      .then((data) => setCategories(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayCategories = categories.slice(0, 4)

  if (loading) {
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
        {displayCategories.map((category, index) => {
          const color = COLORS[index % COLORS.length]
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`group ${color.bg} border ${color.border} rounded-xl p-3 hover:shadow-sm transition-all duration-200`}
            >
              <h3 className={`font-semibold text-xs sm:text-sm text-gray-800 line-clamp-1 mb-0.5`}>
                {category.name}
              </h3>
              {category.subcategories?.length > 0 && (
                <p className="text-[9px] text-gray-400 mb-1.5">
                  {category.subcategories.length} subcategories
                </p>
              )}
              <div className={`flex items-center gap-0.5 text-[9px] font-semibold ${color.text}`}>
                Browse <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {categories.length > 4 && (
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Grid3X3 size={13} />
          View all {categories.length} categories
          <ArrowRight size={11} />
        </Link>
      )}
    </section>
  )
}