// Frontend: src/lib/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizen-backend.onrender.com/api'

// Helper function for fetch with error handling
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
      console.error(`API Error: ${endpoint} - ${res.status} ${res.statusText}`)
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

  /**
   * Get all products with optional filters
   * @param {Object} params - Filter parameters
   * @param {string} params.category - Category ID
   * @param {string} params.subcategory - Subcategory ID
   * @param {string} params.product_type - 'new', 'refurbished', or 'rental'
   * @param {string} params.search - Search query
   * @param {number} params.page - Page number
   * @param {boolean} params.is_featured - Filter featured products
   */
  async getProducts(params = {}) {
    try {
      const searchParams = new URLSearchParams()

      if (params.category) searchParams.append('subcategory__category', params.category)
      if (params.subcategory) searchParams.append('subcategory', params.subcategory)
      if (params.product_type) searchParams.append('product_type', params.product_type)
      if (params.search) searchParams.append('search', params.search)
      if (params.page) searchParams.append('page', params.page)
      if (params.is_featured) searchParams.append('is_featured', 'true')

      const queryString = searchParams.toString()
      const endpoint = queryString ? `/products/?${queryString}` : '/products/'

      const data = await fetchAPI(endpoint, {
        next: { revalidate: 30 } // Cache for 30 seconds
      })

      return data || { count: 0, results: [], next: null, previous: null }
    } catch (error) {
      console.error('getProducts failed:', error)
      return { count: 0, results: [], next: null, previous: null }
    }
  },

  /**
   * Get single product by slug or ID
   * @param {string|number} slugOrId - Product slug or ID
   */
  async getProduct(slugOrId) {
    try {
      const data = await fetchAPI(`/products/${slugOrId}/`, {
        next: { revalidate: 60 }
      })
      return data
    } catch (error) {
      console.error('getProduct failed:', error)
      return null
    }
  },

  /**
   * Get featured products (max 6)
   */
  async getFeaturedProducts() {
    try {
      const data = await fetchAPI('/products/featured/', {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getFeaturedProducts failed:', error)
      return []
    }
  },

  /**
   * Get new products (max 8)
   */
  async getNewProducts() {
    try {
      const data = await fetchAPI('/products/new/', {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getNewProducts failed:', error)
      return []
    }
  },

  /**
   * Get refurbished products (max 8)
   */
  async getRefurbishedProducts() {
    try {
      const data = await fetchAPI('/products/refurbished/', {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getRefurbishedProducts failed:', error)
      return []
    }
  },

  /**
   * Get rental products (max 8)
   */
  async getRentalProducts() {
    try {
      const data = await fetchAPI('/products/rental/', {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getRentalProducts failed:', error)
      return []
    }
  },

  // ==================== CATEGORIES ====================

  /**
   * Get all categories with subcategories
   * @param {boolean} navbarOnly - Get only navbar categories
   */
  async getCategories(navbarOnly = false) {
    try {
      const endpoint = navbarOnly ? '/categories/?navbar=true' : '/categories/'
      const data = await fetchAPI(endpoint, {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getCategories failed:', error)
      return []
    }
  },

  /**
   * Get single category by slug
   * @param {string} slug - Category slug
   */
  async getCategory(slug) {
    try {
      const data = await fetchAPI(`/categories/${slug}/`, {
        next: { revalidate: 60 }
      })
      return data
    } catch (error) {
      console.error('getCategory failed:', error)
      return null
    }
  },

  // ==================== SUBCATEGORIES ====================

  /**
   * Get all subcategories
   * @param {number} categoryId - Filter by category ID
   */
  async getSubcategories(categoryId = null) {
    try {
      const endpoint = categoryId
        ? `/subcategories/?category=${categoryId}`
        : '/subcategories/'

      const data = await fetchAPI(endpoint, {
        next: { revalidate: 60 }
      })
      return data || []
    } catch (error) {
      console.error('getSubcategories failed:', error)
      return []
    }
  },

  /**
   * Get single subcategory by slug
   * @param {string} slug - Subcategory slug
   */
  async getSubcategory(slug) {
    try {
      const data = await fetchAPI(`/subcategories/${slug}/`, {
        next: { revalidate: 60 }
      })
      return data
    } catch (error) {
      console.error('getSubcategory failed:', error)
      return null
    }
  },

  // ==================== QUOTES ====================

  /**
   * Submit a quote request
   * @param {Object} quoteData - Quote information
   * @param {string} quoteData.name - Customer name
   * @param {string} quoteData.email - Customer email
   * @param {string} quoteData.phone - Customer phone
   * @param {string} quoteData.company - Company name (optional)
   * @param {string} quoteData.message - Additional message (optional)
   * @param {Array} quoteData.items - Array of product items
   */
  async submitQuote(quoteData) {
    try {
      const res = await fetch(`${API_URL}/quotes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
        cache: 'no-store' // Don't cache POST requests
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('submitQuote failed:', res.status, errorData)
        return { success: false, error: errorData }
      }

      const data = await res.json()
      return { success: true, data }
    } catch (error) {
      console.error('submitQuote failed:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Get all quotes (admin only)
   */
  async getQuotes() {
    try {
      const data = await fetchAPI('/quotes/')
      return data || []
    } catch (error) {
      console.error('getQuotes failed:', error)
      return []
    }
  },

  // ==================== PRODUCT LISTINGS (SEO-friendly URLs) ====================

  /**
   * Get products by type only
   * Example: /listing/new
   * @param {string} productType - 'new', 'refurbished', or 'rental'
   */
  async getProductsByType(productType) {
    try {
      const data = await fetchAPI(`/listing/${productType}/`, {
        next: { revalidate: 30 }
      })
      return data || { products: [], filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByType failed:', error)
      return { products: [], filter: {}, count: 0 }
    }
  },

  /**
   * Get products by category only
   * Example: /listing/category/office-supplies
   * @param {string} categorySlug - Category slug
   */
  async getProductsByCategory(categorySlug) {
    try {
      const data = await fetchAPI(`/listing/category/${categorySlug}/`, {
        next: { revalidate: 30 }
      })
      return data || { products: [], category: null, filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByCategory failed:', error)
      return { products: [], category: null, filter: {}, count: 0 }
    }
  },

  /**
   * Get products by type AND category
   * Example: /listing/new/office-supplies
   * @param {string} productType - 'new', 'refurbished', or 'rental'
   * @param {string} categorySlug - Category slug
   */
  async getProductsByTypeAndCategory(productType, categorySlug) {
    try {
      const data = await fetchAPI(`/listing/${productType}/${categorySlug}/`, {
        next: { revalidate: 30 }
      })
      return data || { products: [], category: null, filter: {}, count: 0 }
    } catch (error) {
      console.error('getProductsByTypeAndCategory failed:', error)
      return { products: [], category: null, filter: {}, count: 0 }
    }
  },

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Get image URL with fallback
   * @param {string|null} imageUrl - Image URL from backend
   * @returns {string} Full image URL or placeholder
   */
  getImageUrl(imageUrl) {
    if (!imageUrl) return '/placeholder-product.png'

    // If it's already a full URL (Cloudinary), return as is
    if (imageUrl.startsWith('http')) return imageUrl

    // If it's a relative path, prepend backend URL
    return `${API_URL.replace('/api', '')}${imageUrl}`
  },

  /**
   * Format price with currency
   * @param {string|number} price - Price value
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    return `AED ${parseFloat(price).toFixed(2)}`
  },

  /**
   * Check if product is available
   * @param {Object} product - Product object
   * @returns {boolean}
   */
  isProductAvailable(product) {
    return product.is_active && product.in_stock && product.stock_count > 0
  },

  /**
   * Get product type badge color
   * @param {string} productType - 'new', 'refurbished', or 'rental'
   * @returns {string} Tailwind color class
   */
  getProductTypeBadgeColor(productType) {
    const colors = {
      new: 'bg-green-500',
      refurbished: 'bg-orange-500',
      rental: 'bg-blue-500'
    }
    return colors[productType] || 'bg-gray-500'
  }
}

// Export individual functions for convenience
export const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewProducts,
  getRefurbishedProducts,
  getRentalProducts,
  getCategories,
  getCategory,
  getSubcategories,
  getSubcategory,
  submitQuote,
  getQuotes,
  getProductsByType,
  getProductsByCategory,
  getProductsByTypeAndCategory,
  getImageUrl,
  formatPrice,
  isProductAvailable,
  getProductTypeBadgeColor
} = api

export default api