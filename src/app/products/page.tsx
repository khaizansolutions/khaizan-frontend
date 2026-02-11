'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import { ProductCardSkeleton } from '@/components/common/LoadingSkeleton'
import { products as staticProducts } from '@/data/products'
import { api } from '@/lib/api'

// Get API URL - matches your lib/api.js pattern
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizen-backend.onrender.com/api'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const subcategoryParam = searchParams.get('subcategory')

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [displayProducts, setDisplayProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [pageTitle, setPageTitle] = useState('All Products')
  const [pageDescription, setPageDescription] = useState('Discover our complete range of office supplies')

  const categories = [
    'Office Supplies',
    'Paper Products',
    'Ink & Toner',
    'Technology',
    'Office Furniture',
    'Office Machines'
  ]

  useEffect(() => {
    fetchAllProducts()
  }, [categoryParam, subcategoryParam])

  const fetchAllProducts = async () => {
    try {
      setLoading(true)

      let apiProductList = []

      // Check if we have subcategory filter from URL
      if (subcategoryParam) {
        // Fetch products filtered by subcategory
        const response = await fetch(`${API_URL}/listing/subcategory/${subcategoryParam}`)
        const data = await response.json()
        apiProductList = data.products || []

        // Update page title
        if (data.subcategory) {
          setPageTitle(data.subcategory.name)
          setPageDescription(data.subcategory.description || `Browse our ${data.subcategory.name} products`)
        }
      }
      // Check if we have category filter from URL
      else if (categoryParam) {
        // Fetch products filtered by category
        const response = await fetch(`${API_URL}/listing/category/${categoryParam}`)
        const data = await response.json()
        apiProductList = data.products || []

        // Update page title
        if (data.category) {
          setPageTitle(data.category.name)
          setPageDescription(data.category.description || `Browse our ${data.category.name} products`)
        }
      }
      // No filters - fetch all products
      else {
        const apiData = await api.getProducts()
        apiProductList = apiData.results || apiData || []
        setPageTitle('All Products')
        setPageDescription('Discover our complete range of office supplies')
      }

      // Transform API products
      const transformedApiProducts = apiProductList.map((product: any) => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: product.main_image || product.image,
        category: product.category_name || product.category,
      }))

      // If no filters, also include static products
      let combined = transformedApiProducts
      if (!categoryParam && !subcategoryParam) {
        const transformedStaticProducts = staticProducts.map((product: any) => ({
          ...product,
          id: `static-${product.id}`,
          image: product.image || product.main_image,
        }))
        combined = [...transformedApiProducts, ...transformedStaticProducts]
      }

      setAllProducts(combined)
      setDisplayProducts(combined)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to static products if API fails
      const fallback = staticProducts.map((product: any) => ({
        ...product,
        id: `static-${product.id}`,
      }))
      setAllProducts(fallback)
      setDisplayProducts(fallback)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleApplyFilters = () => {
    let filtered = [...allProducts]

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productCategory = product.category_name || product.category
        return selectedCategories.includes(productCategory as string)
      })
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
          return priceA - priceB
        })
        break
      case 'price-high':
        filtered.sort((a: any, b: any) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
          return priceB - priceA
        })
        break
      case 'newest':
        filtered.reverse()
        break
      default:
        break
    }

    setDisplayProducts(filtered)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSortBy('featured')
    setDisplayProducts(allProducts)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-gray-600 text-sm md:text-base">
          {pageDescription}
        </p>
        {(categoryParam || subcategoryParam) && (
          <div className="mt-2">
            <a
              href="/products"
              className="text-sm text-primary hover:underline"
            >
              ← View all products
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Filters Sidebar */}
        <ProductFilters
          categories={categories}
          selectedCategories={selectedCategories}
          priceRange={0}
          maxPrice={0}
          onCategoryChange={handleCategoryChange}
          onPriceChange={() => {}}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Products Grid Section */}
        <div className="flex-1">
          {/* Sort & Count Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <p className="text-gray-600 text-sm md:text-base">
              {loading
                ? 'Loading products...'
                : `${displayProducts.length} Products Found`
              }
            </p>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                handleApplyFilters()
              }}
              className="border px-3 md:px-4 py-2 rounded-lg text-sm md:text-base w-full sm:w-auto focus:outline-none focus:border-primary"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : displayProducts.length > 0 ? (
              displayProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-2 lg:col-span-3 text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-24 h-24 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or view all products
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}