// src/app/products/[slug]/page.tsx
// ✅ SEO FIX: This is now a SERVER component wrapper
// - generateMetadata fetches product data server-side for dynamic meta tags
// - ProductSchema + BreadcrumbSchema injected here
// - Client interactivity moved to ProductDetailClient.tsx

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import ProductSchema from '@/components/seo/ProductSchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizan-backend.onrender.com/api'

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}/`, {
      next: { revalidate: 300 }, // 5 min cache
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ✅ SEO FIX: Dynamic meta per product — title, description, OG image
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params)
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    }
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const imageUrl = product.main_image || product.image || '/og-image.jpg'
  const categoryName = product.category_name || product.category || 'Office Supplies'
  const description = product.description
    ? product.description.slice(0, 155).replace(/\n/g, ' ')
    : `Buy ${product.name} in Dubai, UAE. ${categoryName} at competitive prices. Fast delivery across UAE.`

  return {
    title: `${product.name} – AED ${price.toFixed(0)} | Khaizan Solutions Dubai`,
    description,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${product.name} – AED ${price.toFixed(0)}`,
      description,
      url: `https://www.khaizan.com/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} – AED ${price.toFixed(0)}`,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const { slug } = await Promise.resolve(params)
  const product = await getProduct(slug)

  if (!product) notFound()

  const categoryName = product.category_name || product.category || 'Office Supplies'

  return (
    <>
      {/* ✅ SEO: Product structured data */}
      <ProductSchema product={product} />

      {/* ✅ SEO: Breadcrumb structured data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.khaizan.com' },
          { name: 'Products', url: 'https://www.khaizan.com/products' },
          { name: categoryName, url: `https://www.khaizan.com/products?category=${product.category_slug || product.category}` },
          { name: product.name, url: `https://www.khaizan.com/products/${slug}` },
        ]}
      />

      {/* Client component handles all interactivity */}
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  )
}