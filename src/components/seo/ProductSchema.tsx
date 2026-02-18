import Script from 'next/script'

interface ProductSchemaProps {
  product: {
    name: string
    description?: string
    price: number
    original_price?: number
    image?: string
    main_image?: string
    slug?: string
    id: number
    brand?: string
    in_stock?: boolean
    category_name?: string
  }
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const imageUrl = product.image || product.main_image || 'https://www.khaizan.com/og-image.jpg'
  const productUrl = `https://www.khaizan.com/products/${product.slug || product.id}`
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const originalPrice = product.original_price
    ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price)
    : null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} available at Khaizan Solutions Dubai`,
    image: imageUrl,
    url: productUrl,
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand }
      : { '@type': 'Brand', name: 'Khaizan Solutions' },
    category: product.category_name || 'Office Supplies',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'AED',
      price: price.toFixed(2),
      ...(originalPrice && originalPrice > price && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Khaizan Solutions',
        url: 'https://www.khaizan.com',
      },
      areaServed: {
        '@type': 'Country',
        name: 'United Arab Emirates',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'AED',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'AE',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
  }

  return (
    <Script
      id={`schema-product-${product.id}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}