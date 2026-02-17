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
  image?: string
  navbar_order: number
  subcategories: Subcategory[]
}

const COLORS = [
  { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100 hover:border-blue-300' },
  { bg: 'bg-green-50', icon: 'bg-green-100', text: 'text-green-600', border: 'border-green-100 hover:border-green-300' },
  { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100 hover:border-purple-300' },
  { bg: 'bg-orange-50', icon: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100 hover:border-orange-300' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories/?navbar=true`, { cache: 'no-store' })
        const data = await res.json()
        setCategories(data.results || data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Show only first 4
  const displayCategories = categories.slice(0, 4)

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
        <p className="text-gray-500">Browse our wide range of products</p>
      </div>

      {/* First 4 Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {displayCategories.map((category, index) => {
          const color = COLORS[index % COLORS.length]
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`group bg-white rounded-2xl border-2 ${color.border} shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center`}
            >
              {/* Icon / Image */}
              <div className={`${color.icon} w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className={`text-2xl font-bold ${color.text}`}>
                    {category.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                {category.name}
              </h3>

              {/* Subcategory count */}
              {category.subcategories?.length > 0 && (
                <p className="text-xs text-gray-400">
                  {category.subcategories.length} subcategories
                </p>
              )}

              {/* Arrow */}
              <div className={`flex items-center justify-center gap-1 mt-3 text-xs font-semibold ${color.text} group-hover:gap-2 transition-all`}>
                Browse <ArrowRight size={12} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* View All Categories Button */}
      {categories.length > 4 && (
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            <Grid3X3 size={18} />
            View All {categories.length} Categories
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  )
}