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
  category?: string
  category_id?: number | string
  subcategory_id?: number | string
  subcategory_name?: string
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
  subcategories?: Array<{ id: number; name: string; slug: string; category_name?: string }>
}

interface ProductsPageContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  totalCount: number
  initialProductType?: string | null
  initialCategory?: string | null
  initialSubcategory?: string | null
  initialSearch?: string | null
}

function resolveInitialCategoryNames(
  initialCategory: string | null | undefined,
  initialSubcategory: string | null | undefined,
  initialCategories: Category[],
): string[] {
  if (!initialCategories?.length) return []
  if (initialSubcategory) {
    for (const cat of initialCategories) {
      const found = cat.subcategories?.find(sub => sub.slug === initialSubcategory)
      if (found) return [cat.name]
    }
  }
  if (initialCategory) {
    const bySlug = initialCategories.find(c => c.slug === initialCategory)
    if (bySlug) return [bySlug.name]
    const byName = initialCategories.find(
      c => c.name.toLowerCase().replace(/\s+/g, '-') === initialCategory.toLowerCase()
    )
    if (byName) return [byName.name]
  }
  return []
}

export default function ProductsPageContent({
  initialProducts,
  initialCategories,
  totalCount,
  initialProductType,
  initialCategory,
  initialSubcategory,
  initialSearch,
}: ProductsPageContentProps) {

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    resolveInitialCategoryNames(initialCategory, initialSubcategory, initialCategories)
  )
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    initialProductType ? [initialProductType] : []
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')

  useEffect(() => {
    setSelectedCategories(resolveInitialCategoryNames(initialCategory, initialSubcategory, initialCategories))
  }, [initialCategory, initialSubcategory, initialCategories.length])

  useEffect(() => {
    setSelectedProductTypes(initialProductType ? [initialProductType] : [])
  }, [initialProductType])

  useEffect(() => {
    setSearchQuery(initialSearch || '')
  }, [initialSearch])

  const maxPrice = useMemo(() => {
    const prices = initialProducts.map(p => parseFloat(p.price)).filter(n => !isNaN(n))
    return Math.ceil(Math.max(...prices, 10000))
  }, [initialProducts])

  useEffect(() => {
    setPriceRange([0, maxPrice])
  }, [maxPrice])

  const productTypes = useMemo(() => [
    { value: 'new', label: 'New', count: initialProducts.filter(p => p.product_type === 'new').length },
    { value: 'refurbished', label: 'Refurbished', count: initialProducts.filter(p => p.product_type === 'refurbished').length },
    { value: 'rental', label: 'Rental', count: initialProducts.filter(p => p.product_type === 'rental').length },
  ], [initialProducts])

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      if (selectedCategories.length > 0) {
        const productCatName = (product.category_name || product.category || '').toLowerCase()
        if (!selectedCategories.some(sel => sel.toLowerCase() === productCatName)) return false
      }
      if (selectedProductTypes.length > 0 && !selectedProductTypes.includes(product.product_type)) return false
      const price = parseFloat(product.price)
      if (!isNaN(price) && (price < priceRange[0] || price > priceRange[1])) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const text = `${product.name} ${product.brand || ''} ${product.category_name || ''}`.toLowerCase()
        if (!text.includes(query)) return false
      }
      return true
    })
  }, [initialProducts, selectedCategories, selectedProductTypes, priceRange, searchQuery])

  const categoriesForFilter = useMemo(() =>
    initialCategories.map(cat => ({
      id: cat.name,
      name: cat.name,
      count: initialProducts.filter(
        p => (p.category_name || p.category || '').toLowerCase() === cat.name.toLowerCase()
      ).length,
    })),
    [initialCategories, initialProducts]
  )

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName) ? prev.filter(n => n !== categoryName) : [...prev, categoryName]
    )
  }

  const handleProductTypeChange = (type: string) => {
    setSelectedProductTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedProductTypes([])
    setPriceRange([0, maxPrice])
    setSearchQuery('')
  }

  const activeFilterLabel = useMemo(() => {
    if (initialSubcategory) return initialSubcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    if (initialCategory) return initialCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    if (initialProductType) return initialProductType.charAt(0).toUpperCase() + initialProductType.slice(1) + ' Products'
    return null
  }, [initialCategory, initialSubcategory, initialProductType])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-6">

        {/* ── Header ── */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeFilterLabel ?? 'Our Products'}
          </h1>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <ProductFilters
            categories={categoriesForFilter}
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
                  className="px-6 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // ✅ 3 cols mobile, 4 cols tablet, 5 cols desktop — compact professional grid
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {filteredProducts.map(product => (
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