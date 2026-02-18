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
  slug?: string
  product_count: number
}

interface ProductsPageContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  totalCount: number
  initialProductType?: string | null
  initialCategory?: string | null
  initialSearch?: string | null
}

export default function ProductsPageContent({
  initialProducts,
  initialCategories,
  totalCount,
  initialProductType,
  initialCategory,
  initialSearch,
}: ProductsPageContentProps) {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    initialProductType ? [initialProductType] : []
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')

  useEffect(() => {
    if (!initialCategory || !initialCategories.length) return

    const bySlug = initialCategories.find((c) => c.slug === initialCategory)
    if (bySlug) { setSelectedCategories([bySlug.id.toString()]); return }

    const byName = initialCategories.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, '-') === initialCategory.toLowerCase()
    )
    if (byName) { setSelectedCategories([byName.id.toString()]); return }

    const matchingProduct = initialProducts.find(
      (p) => (p.category || '').toLowerCase().replace(/\s+/g, '-') === initialCategory.toLowerCase()
    )
    if (matchingProduct?.category_id) {
      setSelectedCategories([matchingProduct.category_id.toString()])
    }
  }, [initialCategory, initialCategories, initialProducts])

  // ✅ DEBUG: Remove after fixing
  useEffect(() => {
    console.log('=== FILTER DEBUG ===')
    console.log('initialCategory:', initialCategory)
    console.log('initialCategories:', JSON.stringify(initialCategories.slice(0, 3)))
    console.log('selectedCategories:', selectedCategories)
    console.log('product sample:', JSON.stringify(initialProducts.slice(0, 2).map(p => ({
      id: p.id,
      category_id: p.category_id,
      category: p.category,
      category_name: p.category_name
    }))))
  }, [selectedCategories])

  const maxPrice = useMemo(() => {
    const prices = initialProducts.map((p) => parseFloat(p.price))
    return Math.ceil(Math.max(...prices, 10000))
  }, [initialProducts])

  useEffect(() => {
    setPriceRange([0, maxPrice])
  }, [maxPrice])

  const productTypes = useMemo(() => [
    { value: 'new', label: 'New', count: initialProducts.filter((p) => p.product_type === 'new').length },
    { value: 'refurbished', label: 'Refurbished', count: initialProducts.filter((p) => p.product_type === 'refurbished').length },
    { value: 'rental', label: 'Rental', count: initialProducts.filter((p) => p.product_type === 'rental').length },
  ], [initialProducts])

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id?.toString())) return false
      if (selectedProductTypes.length > 0 && !selectedProductTypes.includes(product.product_type)) return false
      const price = parseFloat(product.price)
      if (price < priceRange[0] || price > priceRange[1]) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${product.name} ${product.brand} ${product.category_name || product.category}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }
      return true
    })
  }, [initialProducts, selectedCategories, selectedProductTypes, priceRange, searchQuery])

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

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedProductTypes([])
    setPriceRange([0, maxPrice])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-6">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Our Products</h1>
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-semibold text-blue-600">{filteredProducts.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> products
          </p>
        </div>

        <div className="flex gap-4 sm:gap-6">
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
            onPriceChange={setPriceRange}
            onSearchChange={setSearchQuery}
            onApplyFilters={() => {}}
            onClearFilters={handleClearFilters}
            productTypes={productTypes}
            selectedProductTypes={selectedProductTypes}
            onProductTypeChange={handleProductTypeChange}
          />

          <main className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
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