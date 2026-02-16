"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Briefcase, Printer, Monitor, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

export default function CategoryGrid() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories(true) // Get navbar categories only
      // Get first 4 categories
      setCategories(data.slice(0, 4))
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Icon mapping for categories
  const getIconForCategory = (categoryName) => {
    const iconMap = {
      'Office Supplies': Package,
      'Paper Products': Briefcase,
      'Ink & Toner': Printer,
      'Technology': Monitor,
      'Office Machines': Printer,
      'Furniture': Briefcase,
      'Storage': Package,
    }
    return iconMap[categoryName] || Package
  }

  // Color mapping for categories
  const getColorForIndex = (index) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-600' },
      { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-600' },
      { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-600' },
      { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-600' },
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null // Don't show section if no categories
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
        >
          View All <ChevronRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const IconComponent = getIconForCategory(category.name)
          const colors = getColorForIndex(index)

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center ${colors.hover} hover:text-white`}>
                <div className={`${colors.bg} ${colors.text} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition group-hover:bg-white`}>
                  <IconComponent size={40} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 group-hover:text-white/90 line-clamp-2">
                    {category.description}
                  </p>
                )}
                {category.product_count > 0 && (
                  <p className="text-xs text-gray-500 mt-2 group-hover:text-white/80">
                    {category.product_count} products
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}