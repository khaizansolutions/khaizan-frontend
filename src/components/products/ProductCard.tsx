'use client'
import Link from 'next/link'
import { ShoppingCart, MessageCircle, Plus, Minus } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'

export default function ProductCard({ product }: { product: any }) {
  const { addToQuote, removeFromQuote, getItemQuantity } = useQuote()

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const imageUrl = product.image || product.main_image || '/placeholder.png'
  const categoryName = product.category_name || product.category
  const quantity = getItemQuantity(product.id)

  // Use slug if available, otherwise fallback to ID
  const productUrl = product.slug ? `/products/${product.slug}` : `/products/${product.id}`

  const handleWhatsApp = () => {
    const message = `Hi, I am interested in:\n\n*${product.name}*\nPrice: AED ${price.toFixed(2)}\nCategory: ${categoryName}\n\nCould you provide more details?`
    const whatsappUrl = `https://wa.me/971445222261?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAddToQuote = () => {
    addToQuote({
      id: product.id,
      name: product.name,
      price: price,
      image: imageUrl,
      category: categoryName,
    })
  }

  const handleRemoveFromQuote = () => {
    removeFromQuote(product.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition">
      <Link href={productUrl}>
        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-100">
          {imageUrl && imageUrl !== '/placeholder.png' ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-secondary text-white px-2 py-1 text-[10px] sm:text-xs rounded">{categoryName}</span>
          </div>
        </div>
      </Link>
      <div className="p-2 sm:p-3 md:p-4">
        <Link href={productUrl}>
          <h3 className="font-semibold text-gray-800 mb-2 hover:text-primary line-clamp-2 text-xs sm:text-sm md:text-base leading-tight">{product.name}</h3>
        </Link>
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary mb-2 sm:mb-3 md:mb-4">AED {price.toFixed(2)}</div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2">
          {quantity === 0 ? (
            <button onClick={handleAddToQuote} className="flex-1 bg-primary text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm">
              <ShoppingCart size={18} /> Add to Quote
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-primary text-white rounded-lg overflow-hidden">
              <button onClick={handleRemoveFromQuote} className="px-3 py-2 hover:bg-blue-700 transition">
                <Minus size={18} />
              </button>
              <span className="font-semibold">{quantity}</span>
              <button onClick={handleAddToQuote} className="px-3 py-2 hover:bg-blue-700 transition">
                <Plus size={18} />
              </button>
            </div>
          )}
          <button onClick={handleWhatsApp} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition" title="Inquire on WhatsApp">
            <MessageCircle size={18} />
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden flex-col gap-1.5 sm:gap-2">
          {quantity === 0 ? (
            <button onClick={handleAddToQuote} className="w-full bg-primary text-white py-1.5 sm:py-2 px-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
              <ShoppingCart size={12} className="sm:w-4 sm:h-4" /><span>Add to Quote</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-primary text-white rounded-lg overflow-hidden py-1.5 sm:py-2">
              <button onClick={handleRemoveFromQuote} className="px-2 sm:px-3 hover:bg-blue-700 transition">
                <Minus size={12} className="sm:w-4 sm:h-4" />
              </button>
              <span className="font-semibold text-[10px] sm:text-xs">{quantity}</span>
              <button onClick={handleAddToQuote} className="px-2 sm:px-3 hover:bg-blue-700 transition">
                <Plus size={12} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
          <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white py-1.5 sm:py-2 px-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
            <MessageCircle size={12} className="sm:w-4 sm:h-4" /><span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  )
}