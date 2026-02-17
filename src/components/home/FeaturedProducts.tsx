'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API_URL}/products/featured/`, { next: { revalidate: 60 } } as any)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="px-3 sm:px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800">Featured Products</h2>
        <div className="flex items-center gap-2">
          {/* Scroll Arrows */}
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Slider */}
      {loading ? (
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] h-52 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? null : (
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}