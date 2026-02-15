"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowRight, Package } from 'lucide-react';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khaizen-backend.onrender.com/api'

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  original_price: string | null;
  discount: number;
  brand: string;
  rating: string;
  reviews: number;
  main_image: string | null;
  in_stock: boolean;
  listing_type: string;
}

export default function RefurbishedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch only REFURBISHED products using environment variable
      const response = await fetch(`${API_URL}/products/?listing_type=refurbished&limit=4`);
      const data = await response.json();
      setProducts(data.results || data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Refurbished Products</h2>
            <p className="text-gray-600 mt-1">Quality products at great prices</p>
          </div>
          {products.length > 0 && (
            <Link
              href="/products?type=refurbished"
              className="flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse h-96"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white border rounded-lg hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="relative h-64 bg-gray-50">
        {product.main_image ? (
          <Image src={product.main_image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
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
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(parseFloat(product.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-600">AED {product.price}</span>
          {product.original_price && (
            <span className="text-sm text-gray-500 line-through">AED {product.original_price}</span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); }}
          className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            product.in_stock ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}