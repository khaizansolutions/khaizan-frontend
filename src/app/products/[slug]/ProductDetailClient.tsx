'use client'
// src/app/products/[slug]/ProductDetailClient.tsx
// ✅ SEO FIX: Extracted from page.tsx so server wrapper can handle metadata + schema
// - Accepts initialProduct from server (no loading flash for product data)
// - Falls back to client fetch if needed

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, MessageCircle, Star, Truck, Shield, RefreshCcw, ArrowLeft, Package } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'
import { ProductDetailSkeleton } from '@/components/common/LoadingSkeleton'
import { api } from '@/lib/api'

interface ProductDetailClientProps {
  slug: string
  initialProduct?: any
}

export default function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const [loading, setLoading] = useState(!initialProduct)
  const [product, setProduct] = useState<any>(initialProduct || null)
  const [activeTab, setActiveTab] = useState('features')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string | null>(
    initialProduct?.main_image || initialProduct?.image || null
  )
  const { addToQuote } = useQuote()

  useEffect(() => {
    // Only fetch client-side if no initialProduct was passed
    if (initialProduct) return
    if (!slug) { setLoading(false); return }
    api.getProduct(slug)
      .then((data) => { setProduct(data); setActiveImage(data?.main_image || data?.image || null) })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug, initialProduct])

  if (loading) return <ProductDetailSkeleton />

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Package size={48} className="text-gray-300 mb-4" />
      <h1 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h1>
      <p className="text-sm text-gray-500 mb-6">This product doesn't exist or was removed.</p>
      <Link href="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
        Browse Products
      </Link>
    </div>
  )

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const originalPrice = product.original_price
    ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price)
    : null
  const imageUrl = activeImage || product.main_image || product.image || null
  const categoryName = product.category_name || product.category
  const stockCount = product.stock_count || 0
  const inStock = product.in_stock ?? true
  const allImages = product.images?.length > 0 ? product.images : []

  const handleAddToQuote = () => {
    addToQuote({ id: product.id, name: product.name, price, image: imageUrl, category: categoryName, quantity })
    alert(`Added ${quantity} item(s) to quote!`)
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in:\n\n*${product.name}*\nQty: ${quantity}\nPrice: AED ${price.toFixed(2)}\nSKU: ${product.sku}\n\nCould you provide more details?`
    window.open(`https://wa.me/971507262269?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-8">

      {/* ── Top Nav ── */}
      <div className="bg-white border-b px-3 py-3 flex items-center gap-2 sticky top-0 z-10">
        <Link href="/products" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
          <ArrowLeft size={18} className="text-gray-700" />
        </Link>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-blue-600 shrink-0">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/products" className="hover:text-blue-600 shrink-0">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">

          {/* ── Image Section ── */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square relative">
              {imageUrl ? (
                // ✅ SEO FIX: Next.js Image with proper alt
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Package size={40} className="text-gray-300" />
                  <span className="text-xs text-gray-400">No Image</span>
                </div>
              )}
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {allImages.map((img: any, i: number) => {
                  const url = typeof img === 'string' ? img : img.image
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(url)}
                      aria-label={`View image ${i + 1} of ${product.name}`}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition ${
                        activeImage === url ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`${product.name} view ${i + 1}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">

            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
              {product.brand && <span className="font-semibold">{product.brand}</span>}
              {product.brand && product.sku && <span>·</span>}
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-xs text-gray-500">{product.rating}/5 · {product.reviews} reviews</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-blue-600">AED {price.toFixed(2)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-400 line-through">AED {originalPrice.toFixed(2)}</span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <p className="text-xs text-green-600 font-medium mb-3">
                You save AED {(originalPrice - price).toFixed(2)}
              </p>
            )}

            <div className="mb-4">
              {inStock ? (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✓ In Stock {stockCount > 0 && `· ${stockCount} units`}
                </span>
              ) : (
                <span className="inline-flex items-center bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity" className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition text-sm">−</button>
                <span className="px-3 py-2 text-sm font-semibold min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(stockCount || 99, q + 1))} aria-label="Increase quantity" className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition text-sm">+</button>
              </div>
              {stockCount > 0 && <span className="text-[10px] text-gray-400">Max {stockCount}</span>}
            </div>

            <div className="hidden md:flex gap-3 mb-5">
              <button
                onClick={handleAddToQuote}
                disabled={!inStock}
                aria-label={`Add ${product.name} to quote`}
                className="flex-1 bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Quote
              </button>
              <button
                onClick={handleWhatsApp}
                aria-label={`Contact us on WhatsApp about ${product.name}`}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              {[
                { icon: Truck, title: 'Free Delivery', sub: 'Over AED 300' },
                { icon: Shield, title: product.specifications?.Warranty || '1 Year', sub: 'Warranty' },
                { icon: RefreshCcw, title: 'Easy Returns', sub: '30-day policy' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="text-center">
                  <Icon size={18} className="mx-auto mb-1 text-blue-600" aria-hidden="true" />
                  <p className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">{title}</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-4 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto" role="tablist">
            {['features', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4" role="tabpanel">
            {activeTab === 'features' && (
              product.features?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <span className="text-blue-600 mt-0.5 text-xs shrink-0" aria-hidden="true">✓</span>
                      <span className="text-xs sm:text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No features listed.</p>
            )}

            {activeTab === 'specifications' && (
              product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2.5 text-xs sm:text-sm">
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="text-gray-500 text-right ml-4">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No specifications listed.</p>
            )}

            {activeTab === 'reviews' && (
              <p className="text-sm text-gray-400 text-center py-6">Reviews coming soon...</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-3 py-2.5 flex gap-2 z-20">
        <button
          onClick={handleAddToQuote}
          disabled={!inStock}
          aria-label={`Add ${product.name} to quote`}
          className="flex-1 bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={15} />
          Add to Quote
        </button>
        <button
          onClick={handleWhatsApp}
          aria-label={`Contact us on WhatsApp about ${product.name}`}
          className="bg-green-500 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <MessageCircle size={15} />
          WhatsApp
        </button>
      </div>

    </div>
  )
}