"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Calendar, Sparkles, Package } from 'lucide-react'

export default function CategoryGrid() {
  const businessTypes = [
    {
      id: 1,
      name: 'New Products',
      slug: 'new',
      description: 'Brand new office supplies',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-600 hover:text-white'
    },
    {
      id: 2,
      name: 'Rental',
      slug: 'rental',
      description: 'Rent equipment by day/month',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:bg-purple-600 hover:text-white'
    },
    {
      id: 3,
      name: 'Refurbished',
      slug: 'refurbished',
      description: 'Quality refurbished products',
      icon: Sparkles,
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-600 hover:text-white'
    },
    {
      id: 4,
      name: 'All Products',
      slug: 'all',
      description: 'Browse everything',
      icon: Package,
      color: 'bg-amber-100 text-amber-600',
      hoverColor: 'hover:bg-amber-600 hover:text-white'
    }
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Type</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {businessTypes.map((type) => {
          const IconComponent = type.icon

          return (
            <Link
              key={type.id}
              href={`/products?type=${type.slug}`}
              className="group"
            >
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center ${type.hoverColor}`}>
                <div className={`${type.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition group-hover:bg-white`}>
                  <IconComponent size={40} className="group-hover:text-inherit" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-white">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-white/90">
                  {type.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}