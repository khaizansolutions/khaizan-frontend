// src/app/products/ProductsPageContent.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'

interface Product {
  id: number
  slug: string
  name: string
  brand: string
  price: string
  original_price?: string
  discount: number
  main_image: string
  image?: string
  category_name: string
  category: string
  category_id: number
  subcategory_id?: number
  product_type: 'new' | 'refurbished' | 'rental'
  product_type_display: string
  is_featured: boolean
  in_stock: boolean
  stock_count: number
  rating: number
  reviews: number
}

interface Category {
  id: number
  name: string
  product_count: number
}

interface ProductsPageContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  totalCount: number
  // ⭐ ADDED: 3 new optional props from URL
  initialProductType?: string | null
  initialCategory?: string | null
  initialSearch?: string | null
}

export default function ProductsPageContent({
  initialProducts,
  initialCategories,
  totalCount,
  // ⭐ ADDED: Destructure new props
  initialProductType,
  initialCategory,
  initialSearch,
}: ProductsPageContentProps) {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []  // ⭐ CHANGED: Pre-set from URL
  )
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    initialProductType ? [initialProductType] : []  // ⭐ CHANGED: Pre-set from URL
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')  // ⭐ CHANGED: Pre-set from URL

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    const prices = initialProducts.map((p) => parseFloat(p.price))
    return Math.ceil(Math.max(...prices, 10000))
  }, [initialProducts])

  // Set initial price range
  useEffect(() => {
    setPriceRange([0, maxPrice])
  }, [maxPrice])

  // Product types with counts
  const productTypes = useMemo(
    () => [
      {
        value: 'new',
        label: '🆕 New',
        count: initialProducts.filter((p) => p.product_type === 'new').length,
      },
      {
        value: 'refurbished',
        label: '🔧 Refurbished',
        count: initialProducts.filter((p) => p.product_type === 'refurbished').length,
      },
      {
        value: 'rental',
        label: '📅 Rental',
        count: initialProducts.filter((p) => p.product_type === 'rental').length,
      },
    ],
    [initialProducts]
  )

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category_id.toString())
      ) {
        return false
      }

      // Product type filter
      if (
        selectedProductTypes.length > 0 &&
        !selectedProductTypes.includes(product.product_type)
      ) {
        return false
      }

      // Price filter
      const price = parseFloat(product.price)
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText =
          `${product.name} ${product.brand} ${product.category_name || product.category}`.toLowerCase()
        if (!searchableText.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [initialProducts, selectedCategories, selectedProductTypes, priceRange, searchQuery])

  // Handlers
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleProductTypeChange = (type: string) => {
    setSelectedProductTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedProductTypes([])
    setPriceRange([0, maxPrice])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Showing{' '}
            <span className="font-bold text-blue-600">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalCount}</span> products
          </p>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            categories={initialCategories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              count: initialProducts.filter((p) => p.category_id === cat.id).length,
            }))}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            maxPrice={maxPrice}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onSearchChange={handleSearchChange}
            onApplyFilters={() => {}}
            onClearFilters={handleClearFilters}
            productTypes={productTypes}
            selectedProductTypes={selectedProductTypes}
            onProductTypeChange={handleProductTypeChange}
          />

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your search
                  criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={`product-${product.id}-${product.slug}`} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}