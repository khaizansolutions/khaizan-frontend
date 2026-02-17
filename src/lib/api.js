// Frontend: src/lib/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!res.ok) {
      if (!(res.status === 404 && endpoint.includes('/products/'))) {
        console.error(`API Error: ${endpoint} - ${res.status} ${res.statusText}`)
      }
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error)
    return null
  }
}

export const api = {
  // ==================== PRODUCTS ====================

  async getProducts(params = {}) {
    try {
      const searchParams = new URLSearchParams()

      // ⭐ FIX: Use 20 as default, never allow unbounded requests
      searchParams.append('page_size', Math.min(params.page_size || 20, 100))

      if (params.category) searchParams.append('subcategory__category', params.category)
      if (params.subcategory) searchParams.append('subcategory', params.subcategory)
      if (params.product_type) searchParams.append('product_type', params.product_type)
      if (params.search) searchParams.append('search', params.search)
      if (params.page) searchParams.append('page', params.page)
      if (params.is_featured) searchParams.append('is_featured', 'true')

      const data = await fetchAPI(`/products/?${searchParams.toString()}`, {
        next: { revalidate: 30 }
      })

      return data || { count: 0, results: [], next: null, previous: null }
    } catch (error) {
      console.error('getProducts failed:', error)
      return { count: 0, results: [], next: null, previous: null }
    }
  },

  async getProduct(slugOrId) {
    try {
      // Try direct slug/id lookup first
      const directData = await fetchAPI(`/products/${slugOrId}/`, {
        next: { revalidate: 60 }
      })
      if (directData) return directData

      // ⭐ FIX: Fallback fetches max 100, not 1000
      const productsData = await this.getProducts({ page_size: 100 })
      if (productsData?.results?.length > 0) {
        return (
          productsData.results.find(p => p.slug === slugOrId || p.slug === slugOrId.toString()) ||
          productsData.results.find(p => p.id.toString() === slugOrId.toString()) ||
          null
        )
      }
      return null
    } catch (error) {
      console.error('getProduct failed:', error)
      return null
    }
  },

  async getFeaturedProducts() {
    try {
      const data = await fetchAPI('/products/featured/', { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getFeaturedProducts failed:', error)
      return []
    }
  },

  async getNewProducts() {
    try {
      const data = await fetchAPI('/products/new/', { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getNewProducts failed:', error)
      return []
    }
  },

  async getRefurbishedProducts() {
    try {
      const data = await fetchAPI('/products/refurbished/', { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getRefurbishedProducts failed:', error)
      return []
    }
  },

  async getRentalProducts() {
    try {
      const data = await fetchAPI('/products/rental/', { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getRentalProducts failed:', error)
      return []
    }
  },

  // ==================== CATEGORIES ====================

  async getCategories(navbarOnly = false) {
    try {
      const endpoint = navbarOnly ? '/categories/?navbar=true' : '/categories/'
      const data = await fetchAPI(endpoint, { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getCategories failed:', error)
      return []
    }
  },

  async getCategory(slug) {
    try {
      const data = await fetchAPI(`/categories/${slug}/`, { next: { revalidate: 60 } })
      return data
    } catch (error) {
      console.error('getCategory failed:', error)
      return null
    }
  },

  // ==================== SUBCATEGORIES ====================

  async getSubcategories(categoryId = null) {
    try {
      const endpoint = categoryId ? `/subcategories/?category=${categoryId}` : '/subcategories/'
      const data = await fetchAPI(endpoint, { next: { revalidate: 60 } })
      return data || []
    } catch (error) {
      console.error('getSubcategories failed:', error)
      return []
    }
  },

  async getSubcategory(slug) {
    try {
      const data = await fetchAPI(`/subcategories/${slug}/`, { next: { revalidate: 60 } })
      return data
    } catch (error) {
      console.error('getSubcategory failed:', error)
      return null
    }
  },

  // ==================== QUOTES ====================

  async submitQuote(quoteData) {
    try {
      const res = await fetch(`${API_URL}/quotes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
        cache: 'no-store'
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('submitQuote failed:', res.status, errorData)
        return { success: false, error: errorData }
      }

      return { success: true, data: await res.json() }
    } catch (error) {
      console.error('submitQuote failed:', error)
      return { success: false, error: error.message }
    }
  },

  async getQuotes() {
    try {
      const data = await fetchAPI('/quotes/')
      return data || []
    } catch (error) {
      console.error('getQuotes failed:', error)
      return []
    }
  },

  // ==================== PRODUCT LISTINGS ====================

  async getProductsByType(productType) {
    try {
      const data = await fetchAPI(`/listing/${productType}/`, { next: { revalidate: 30 } })
      return data || { products: [], filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByType failed:', error)
      return { products: [], filter: {}, count: 0 }
    }
  },

  async getProductsByCategory(categorySlug) {
    try {
      const data = await fetchAPI(`/listing/category/${categorySlug}/`, { next: { revalidate: 30 } })
      return data || { products: [], category: null, filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByCategory failed:', error)
      return { products: [], category: null, filter: {}, count: 0 }
    }
  },

  async getProductsByTypeAndCategory(productType, categorySlug) {
    try {
      const data = await fetchAPI(`/listing/${productType}/${categorySlug}/`, { next: { revalidate: 30 } })
      return data || { products: [], category: null, filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByTypeAndCategory failed:', error)
      return { products: [], category: null, filter: {}, count: 0 }
    }
  },

  // ==================== HELPERS ====================

  getImageUrl(imageUrl) {
    if (!imageUrl) return '/placeholder-product.png'
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_URL.replace('/api', '')}${imageUrl}`
  },

  formatPrice(price) {
    return `AED ${parseFloat(price).toFixed(2)}`
  },

  isProductAvailable(product) {
    return product.is_active && product.in_stock && product.stock_count > 0
  },

  getProductTypeBadgeColor(productType) {
    const colors = { new: 'bg-green-500', refurbished: 'bg-orange-500', rental: 'bg-blue-500' }
    return colors[productType] || 'bg-gray-500'
  }
}

export const {
  getProducts, getProduct, getFeaturedProducts, getNewProducts,
  getRefurbishedProducts, getRentalProducts, getCategories, getCategory,
  getSubcategories, getSubcategory, submitQuote, getQuotes,
  getProductsByType, getProductsByCategory, getProductsByTypeAndCategory,
  getImageUrl, formatPrice, isProductAvailable, getProductTypeBadgeColor
} = api

export default api