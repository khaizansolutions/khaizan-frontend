'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MessageCircle, Star, Truck, Shield, RefreshCcw, ArrowLeft } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'
import { ProductDetailSkeleton } from '@/components/common/LoadingSkeleton'
import { getProductById } from '@/data/products'
import { api } from '@/lib/api'

export default function RentalProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('features')
  const [rentalDays, setRentalDays] = useState(1)
  const { addToQuote } = useQuote()

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      // Check if it's a static product
      if (resolvedParams.slug.startsWith('static-')) {
        const numericId = parseInt(resolvedParams.slug.replace('static-', ''))
        const staticProduct = getProductById(numericId)

        if (staticProduct && staticProduct.product_type === 'rental') {
          setProduct(staticProduct)
        } else {
          setProduct(null)
        }
      } else {
        // Fetch from Django API
        try {
          const apiProduct = await api.getProduct(resolvedParams.slug)

          if (apiProduct && apiProduct.product_type === 'rental') {
            setProduct(apiProduct)
          } else {
            setProduct(null)
          }
        } catch (error) {
          console.error('API fetch failed:', error)
          setProduct(null)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">The product you're looking for doesn't exist or is not available for rent.</p>
        <Link href="/rental">
          <button className="bg-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-purple-700 transition">
            Browse Rental Products
          </button>
        </Link>
      </div>
    )
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const imageUrl = product.main_image || product.image
  const categoryName = product.category_name || product.category
  const stockCount = product.stock_count || product.stockCount || 0
  const inStock = product.in_stock !== undefined ? product.in_stock : product.inStock
  const totalPrice = price * rentalDays

  const handleAddToQuote = () => {
    addToQuote({
      id: product.id,
      name: `${product.name} (${rentalDays} days rental)`,
      price: totalPrice,
      image: imageUrl,
      category: categoryName,
      quantity: 1,
    })
    alert(`Added ${rentalDays} day rental to quote!`)
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in renting:\n\n*${product.name}*\nRental Period: ${rentalDays} day(s)\nDaily Rate: AED ${price.toFixed(2)}\nTotal: AED ${totalPrice.toFixed(2)}\nSKU: ${product.sku}\n\nCould you provide more details?`
    const whatsappUrl = `https://wa.me/971445222261?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const incrementDays = () => {
    setRentalDays(rentalDays + 1)
  }

  const decrementDays = () => {
    if (rentalDays > 1) setRentalDays(rentalDays - 1)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <Link href="/rental" className="hover:text-purple-600">Rental Products</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Link
          href="/rental"
          className="inline-flex items-center gap-2 text-purple-600 hover:underline mb-4 md:mb-6 text-sm md:text-base"
        >
          <ArrowLeft size={18} className="md:w-5 md:h-5" />
          Back to Rental Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 bg-white rounded-lg shadow-lg p-4 md:p-8">
          {/* Left Column - Images */}
          <div>
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-3 md:mb-4">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-purple-600 text-white px-3 py-1 rounded-full font-bold text-xs md:text-sm flex items-center gap-1">
                <Calendar size={14} />
                FOR RENT
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {product.images.map((img: any, index: number) => {
                  const imgUrl = typeof img === 'string' ? img : img.image
                  return (
                    <div key={index} className="relative h-16 sm:h-20 md:h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-600 transition">
                      <img src={imgUrl} alt={`${product.name} - Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="flex items-center gap-2 md:gap-4 mb-2 text-xs md:text-sm text-gray-500">
              <span>Brand: {product.brand}</span>
              <span>|</span>
              <span>SKU: {product.sku}</span>
            </div>

            <div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              ✓ Available for Daily Rental
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 text-sm md:text-base">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={`md:w-5 md:h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-600 text-xs md:text-sm">{product.rating} / 5</span>
              <span className="text-purple-600 hover:underline cursor-pointer text-xs md:text-sm">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4 md:mb-6 bg-purple-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
                  AED {price.toFixed(2)}
                </span>
                <span className="text-gray-600">/day</span>
              </div>
              {rentalDays > 1 && (
                <p className="text-sm text-gray-600">
                  {rentalDays} days = <span className="font-semibold text-purple-600">AED {totalPrice.toFixed(2)}</span>
                </p>
              )}
            </div>

            {/* Stock Status */}
            {inStock ? (
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <span className="inline-block bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  Available
                </span>
                <span className="text-gray-600 text-xs md:text-sm">({stockCount} units in stock)</span>
              </div>
            ) : (
              <span className="inline-block bg-red-100 text-red-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
                Currently Unavailable
              </span>
            )}

            <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* Rental Period Selector */}
            <div className="mb-4 md:mb-6 bg-gray-50 p-4 rounded-lg">
              <label className="block text-xs md:text-sm font-semibold mb-3">Rental Period (Days):</label>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center border-2 border-purple-300 rounded-lg">
                  <button onClick={decrementDays} className="px-3 md:px-4 py-2 hover:bg-purple-50 transition text-lg md:text-xl text-purple-600">-</button>
                  <input
                    type="number"
                    value={rentalDays}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val >= 1) setRentalDays(val)
                    }}
                    min={1}
                    className="w-16 md:w-20 text-center border-x-2 border-purple-300 py-2 focus:outline-none text-sm md:text-base bg-white"
                  />
                  <button onClick={incrementDays} className="px-3 md:px-4 py-2 hover:bg-purple-50 transition text-lg md:text-xl text-purple-600">+</button>
                </div>
                <span className="text-xs md:text-sm text-gray-600">Minimum: 1 day</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6 md:mb-8">
              <button
                onClick={handleAddToQuote}
                className="flex-1 bg-purple-600 text-white py-3 md:py-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm md:text-lg font-semibold"
              >
                <Calendar size={20} className="md:w-6 md:h-6" />
                Add to Quote
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 md:flex-initial bg-green-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <MessageCircle size={20} className="md:w-6 md:h-6" />
                WhatsApp
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 p-3 md:p-6 bg-purple-50 rounded-lg">
              <div className="text-center">
                <Truck className="mx-auto mb-1 md:mb-2 text-purple-600" size={24} />
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold">Free Delivery</p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">& Pickup</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-1 md:mb-2 text-purple-600" size={24} />
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold">Fully Insured</p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">Equipment</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="mx-auto mb-1 md:mb-2 text-purple-600" size={24} />
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold">Flexible</p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">Rental terms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-6 md:mt-12 bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="border-b mb-4 md:mb-6 overflow-x-auto">
            <div className="flex gap-4 md:gap-8 min-w-max">
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-3 md:pb-4 text-sm md:text-base whitespace-nowrap ${
                  activeTab === 'features' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-3 md:pb-4 text-sm md:text-base whitespace-nowrap ${
                  activeTab === 'specifications' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 md:pb-4 text-sm md:text-base whitespace-nowrap ${
                  activeTab === 'reviews' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Reviews ({product.reviews})
              </button>
            </div>
          </div>

          {activeTab === 'features' && (
            <div>
              <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Key Features</h3>
              {product.features && product.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-purple-50 rounded-lg">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No features listed</p>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Technical Specifications</h3>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 md:p-4 border-b">
                      <span className="font-semibold text-gray-700 text-sm md:text-base">{key}:</span>
                      <span className="text-gray-600 text-sm md:text-base text-right">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specifications listed</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500 text-sm md:text-base">Reviews coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}