"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { products as staticProducts } from '@/data/products';

// Get API URL - matches your lib/api.js pattern
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizen-backend.onrender.com/api'

interface Product {
  id: number | string;
  name: string;
  slug?: string;
  sku?: string;
  price: string | number;
  original_price?: string | null;
  originalPrice?: number;
  discount: number;
  brand: string;
  rating: string | number;
  reviews: number;
  main_image?: string | null;
  image?: string;
  in_stock?: boolean;
  inStock?: boolean;
  product_type?: string;
  category_name?: string;
  category?: string;
  subcategory_name?: string;
}

export default function RefurbishedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch from Django API using environment variable
      const response = await fetch(`${API_URL}/listing/refurbished`);
      const apiData = await response.json();
      const apiProducts = apiData.products || [];

      // Transform API products
      const transformedApiProducts = apiProducts.map((product: any) => ({
        ...product,
        id: product.id,
        price: typeof product.price === 'string' ? product.price : product.price.toString(),
        image: product.main_image || product.image,
        inStock: product.in_stock,
      }));

      // Get static REFURBISHED products
      const staticRefurbishedProducts = staticProducts
        .filter((product: any) => product.product_type === 'refurbished')
        .map((product: any) => ({
          ...product,
          id: `static-${product.id}`,
          slug: `static-${product.id}`,  // FIXED: Use static-ID as slug
          price: product.price.toString(),
          original_price: product.originalPrice?.toString() || null,
          main_image: product.image,
          rating: product.rating.toString(),
          in_stock: product.inStock,
          category_name: product.category,
        }));

      // Combine: API products first, then static
      const combined = [...transformedApiProducts, ...staticRefurbishedProducts];

      setProducts(combined);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);

      // Fallback to only static products
      const staticRefurbishedProducts = staticProducts
        .filter((product: any) => product.product_type === 'refurbished')
        .map((product: any) => ({
          ...product,
          id: `static-${product.id}`,
          slug: `static-${product.id}`,  // FIXED: Use static-ID as slug
          price: product.price.toString(),
          original_price: product.originalPrice?.toString() || null,
          main_image: product.image,
          rating: product.rating.toString(),
          in_stock: product.inStock,
          category_name: product.category,
        }));

      setProducts(staticRefurbishedProducts);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Refurbished Products</h1>
          <p className="text-gray-600">Quality products at great prices</p>
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse h-96"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Refurbished Products Available
            </h3>
            <p className="text-gray-600">
              We don't have any refurbished products at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const productSlug = product.slug || `static-${product.id}`;  // SIMPLIFIED: slug is already correct
  const productImage = product.main_image || product.image;
  const isInStock = product.in_stock ?? product.inStock ?? true;
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
  const originalPrice = product.original_price || (product.originalPrice ? product.originalPrice.toFixed(2) : null);

  return (
    <Link
      href={`/refurbished/${productSlug}`}
      className="group bg-white border rounded-lg hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="relative h-64 bg-gray-50">
        {productImage ? (
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Refurbished Badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          REFURBISHED
        </div>

        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12 group-hover:text-blue-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-600">AED {price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              AED {originalPrice}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); }}
          className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            isInStock
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}