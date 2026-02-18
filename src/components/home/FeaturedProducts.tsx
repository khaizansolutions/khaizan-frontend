'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'

interface FeaturedProductsProps {
  initialProducts?: any[]
}

// ✅ PERF FIX: No more useEffect/fetch — data comes from server via props
// Instant render, no loading spinner, better Core Web Vitals
export default function FeaturedProducts({ initialProducts = [] }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (initialProducts.length === 0) return null

  return (
    <section className="px-3 sm:px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800">Featured Products</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
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
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {initialProducts.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}