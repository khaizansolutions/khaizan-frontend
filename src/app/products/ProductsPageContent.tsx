// src/app/products/ProductsPageContent.tsx

import { getProducts, getCategories } from '@/lib/api'
import ProductImage from '@/components/common/ProductImage'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ProductsPageContent({
  searchParams,
}: {
  searchParams?: {
    category?: string;
    subcategory?: string;
    product_type?: 'new' | 'refurbished' | 'rental';
    search?: string;
  };
}) {
  // Fetch data from Django backend
  // Build params object with only defined values
  const params: any = {}
  if (searchParams?.category) params.category = searchParams.category
  if (searchParams?.subcategory) params.subcategory = searchParams.subcategory
  if (searchParams?.product_type) params.product_type = searchParams.product_type
  if (searchParams?.search) params.search = searchParams.search

  const [productsData, categoriesData] = await Promise.all([
    getProducts(params),
    getCategories(),
  ])

  // Ensure we have arrays
  const products = productsData?.results || []
  const categories = Array.isArray(categoriesData) ? categoriesData : []

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Our Products
        </h1>
        <p className="text-gray-600">
          {productsData?.count || 0} product{(productsData?.count || 0) !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar - Filters */}
        <aside className="w-full md:w-64 space-y-6">
          {/* Product Type Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-3">Product Type</h3>
            <div className="space-y-2">
              <FilterLink
                href="/products"
                label="All Products"
                active={!searchParams?.product_type}
              />
              <FilterLink
                href="/products?product_type=new"
                label="🆕 New"
                active={searchParams?.product_type === 'new'}
              />
              <FilterLink
                href="/products?product_type=refurbished"
                label="🔧 Refurbished"
                active={searchParams?.product_type === 'refurbished'}
              />
              <FilterLink
                href="/products?product_type=rental"
                label="📅 Rental"
                active={searchParams?.product_type === 'rental'}
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-3">Categories</h3>
            <div className="space-y-2">
              <FilterLink
                href="/products"
                label="All Categories"
                active={!searchParams?.category}
              />
              {categories.map((category: any) => (
                <FilterLink
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  label={category.name}
                  active={searchParams?.category === category.id.toString()}
                  count={category.product_count}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <ProductImage
          src={product.main_image}
          alt={product.name}
          fill
          className="group-hover:scale-105 transition-transform duration-200"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
              ⭐ Featured
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
          {product.product_type !== 'new' && (
            <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${
              product.product_type === 'refurbished' ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {product.product_type_display}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-semibold px-4 py-2 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Brand */}
        <p className="text-xs text-gray-500 mb-1">
          {product.category_name} • {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">
            AED {product.price}
          </span>
          {product.original_price && (
            <span className="text-sm text-gray-400 line-through">
              AED {product.original_price}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <span className="text-yellow-400">★</span>
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>

        {/* Stock Info */}
        {product.in_stock && (
          <p className="text-xs text-green-600 mt-2">
            {product.stock_count} in stock
          </p>
        )}
      </div>
    </Link>
  )
}

// Filter Link Component
function FilterLink({
  href,
  label,
  active,
  count
}: {
  href: string;
  label: string;
  active: boolean;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-gray-400 text-xs ml-2">({count})</span>
      )}
    </Link>
  )
}