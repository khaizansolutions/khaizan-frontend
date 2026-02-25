'use client'

import Link from 'next/link'
import { ShoppingCart, MessageCircle, Plus, Minus, Package } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'

export default function ProductCard({ product }: { product: any }) {
  const { addToQuote, removeFromQuote, getItemQuantity } = useQuote()

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const originalPrice = product.original_price
    ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price)
    : null
  const imageUrl = product.image || product.main_image || null
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
    window.open(`https://wa.me/971507262269?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToQuote({ id: product.id, name: product.name, price, image: imageUrl, category: categoryName })
  }

  const handleQuantityChange = (e: React.MouseEvent, action: 'add' | 'remove') => {
    e.preventDefault()
    e.stopPropagation()
    action === 'add'
      ? addToQuote({ id: product.id, name: product.name, price, image: imageUrl, category: categoryName })
      : removeFromQuote(product.id)
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">

      {/* ── Image ── */}
      <Link href={productUrl} className="block flex-shrink-0">
        <div className="relative w-full h-32 sm:h-36 bg-gray-50 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-50">
                      <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      <span class="text-[8px] text-gray-300">No Image</span>
                    </div>
                  `
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-50">
              <Package size={16} className="text-gray-300" />
              <span className="text-[8px] text-gray-300">No Image</span>
            </div>
          )}

          {/* Badges — top left */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {categoryName && (
              <span className="bg-primary text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full leading-tight max-w-[72px] truncate">
                {categoryName}
              </span>
            )}
            {product.product_type && product.product_type !== 'new' && (
              <span className={`text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full leading-tight ${
                product.product_type === 'rental' ? 'bg-secondary' : 'bg-gray-600'
              }`}>
                {product.product_type === 'rental' ? 'Rental' : 'Refurb'}
              </span>
            )}
          </div>

          {/* Discount — top right */}
          {discountPercent > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}

          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-primary text-white text-[9px] font-semibold px-2 py-1 rounded-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 px-2 pt-1.5 pb-2">
        <Link href={productUrl} className="block">
          {product.brand && (
            <p className="text-[7px] font-semibold text-gray-400 uppercase tracking-wider truncate">
              {product.brand}
            </p>
          )}
          <h3 className="text-[10px] font-semibold text-gray-800 leading-snug line-clamp-2 h-[2.4em] mt-0.5">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-bold text-secondary">
              AED {price.toFixed(0)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[8px] text-gray-400 line-through">
                {originalPrice.toFixed(0)}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1" />

        {/* ── Buttons ── */}
        <div className="flex gap-1 mt-1.5">
          {quantity === 0 ? (
            <button
              onClick={handleAddToQuote}
              disabled={!product.in_stock}
              className="flex-1 bg-secondary disabled:bg-gray-100 disabled:text-gray-400 text-white py-1.5 rounded-lg hover:bg-gray-800 active:scale-[0.97] transition-all flex items-center justify-center gap-1 text-[10px] font-semibold"
            >
              <ShoppingCart size={11} />
              <span>Quote</span>
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-secondary text-white rounded-lg overflow-hidden">
              <button onClick={(e) => handleQuantityChange(e, 'remove')} className="px-2 py-1.5 hover:bg-gray-800 transition-colors" aria-label="Remove from quote">
                <Minus size={11} />
              </button>
              <span className="font-bold text-[10px] tabular-nums">{quantity}</span>
              <button onClick={(e) => handleQuantityChange(e, 'add')} className="px-2 py-1.5 hover:bg-gray-800 transition-colors" aria-label="Add to quote">
                <Plus size={11} />
              </button>
            </div>
          )}
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 text-white px-2 py-1.5 rounded-lg hover:bg-green-600 active:scale-[0.97] transition-all flex items-center justify-center"
            aria-label={`Contact us on WhatsApp about ${product.name}`}
          >
            <MessageCircle size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}