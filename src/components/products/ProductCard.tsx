'use client'

import Link from 'next/link'
import { ShoppingCart, MessageCircle, Plus, Minus } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'

export default function ProductCard({ product }: { product: any }) {
  const { addToQuote, removeFromQuote, getItemQuantity } = useQuote()

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const originalPrice = product.original_price ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price) : null
  const imageUrl = product.image || product.main_image || '/placeholder.png'
  const categoryName = product.category_name || product.category
  const quantity = getItemQuantity(product.id)

  const productUrl = product.slug ? `/products/${product.slug}` : `/products/${product.id}`

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : product.discount || 0

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hi, I am interested in:\n\n*${product.name}*\nPrice: AED ${price.toFixed(2)}\nCategory: ${categoryName}\n\nCould you provide more details?`
    const whatsappUrl = `https://wa.me/971544706523?text=${encodeURIComponent(message)}`  // ⭐ Updated number
    window.open(whatsappUrl, '_blank')
  }

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToQuote({
      id: product.id,
      name: product.name,
      price: price,
      image: imageUrl,
      category: categoryName,
    })
  }

  const handleQuantityChange = (e: React.MouseEvent, action: 'add' | 'remove') => {
    e.preventDefault()
    e.stopPropagation()
    if (action === 'add') {
      addToQuote({
        id: product.id,
        name: product.name,
        price: price,
        image: imageUrl,
        category: categoryName,
      })
    } else {
      removeFromQuote(product.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
      <Link href={productUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageUrl && imageUrl !== '/placeholder.png' ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Category Badge - Top Left */}
          <div className="absolute top-2 left-2">
            <span className="bg-orange-500 text-white px-2.5 py-1 text-[10px] font-semibold rounded-full">
              {categoryName}
            </span>
          </div>

          {/* Discount Badge - Top Right */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white px-2.5 py-1 text-[10px] font-semibold rounded-full">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-[10px] text-gray-500 mb-2 font-medium uppercase">
              {product.brand}
            </p>
          )}

          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">
                AED {price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  AED {originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-3 pb-3">
        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-2">
          {quantity === 0 ? (
            <button
              onClick={handleAddToQuote}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
            >
              <ShoppingCart size={16} />
              Add to Quote
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-blue-600 text-white rounded-lg overflow-hidden">
              <button onClick={(e) => handleQuantityChange(e, 'remove')} className="px-3 py-2 hover:bg-blue-700 transition-colors">
                <Minus size={16} />
              </button>
              <span className="font-semibold text-sm">{quantity}</span>
              <button onClick={(e) => handleQuantityChange(e, 'add')} className="px-3 py-2 hover:bg-blue-700 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          )}
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
            title="Inquire on WhatsApp"
          >
            <MessageCircle size={16} />
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex sm:hidden gap-1.5">
          {quantity === 0 ? (
            <button
              onClick={handleAddToQuote}
              className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
            >
              <ShoppingCart size={14} />
              <span>Quote</span>
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-blue-600 text-white rounded-lg overflow-hidden py-1.5">
              <button onClick={(e) => handleQuantityChange(e, 'remove')} className="px-2 hover:bg-blue-700 transition-colors">
                <Minus size={14} />
              </button>
              <span className="font-semibold text-xs">{quantity}</span>
              <button onClick={(e) => handleQuantityChange(e, 'add')} className="px-2 hover:bg-blue-700 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          )}
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 text-white px-2 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <MessageCircle size={14} />
          </button>
        </div>

        {product.in_stock && product.stock_count && (
          <p className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-1 rounded mt-2 inline-block">
            ✓ {product.stock_count} in stock
          </p>
        )}
      </div>
    </div>
  )
}