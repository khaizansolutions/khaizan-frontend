"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, FileText, Printer, Monitor, Package } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  navbar_order: number
}

// Icon mapping
const iconMap: Record<string, any> = {
  'Scissors': Scissors,
  'FileText': FileText,
  'Printer': Printer,
  'Monitor': Monitor,
  'Package': Package,
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // Fetch navbar categories (ordered by navbar_order)
      const response = await fetch('http://localhost:8000/api/categories/?navbar=true')
      const data = await response.json()

      // Get only first 4 categories
      const first4 = (data.results || data).slice(0, 4)
      setCategories(first4)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setLoading(false)
    }
  }

  // Color schemes for categories (cycling)
  const colorSchemes = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-amber-100 text-amber-600',
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-8 rounded-lg shadow-md h-40 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon && iconMap[category.icon]
              ? iconMap[category.icon]
              : Package // Default icon

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center">
                  <div className={`${colorSchemes[index % 4]} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition`}>
                    <IconComponent size={40} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}