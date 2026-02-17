'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'
import SmartSearch from '@/components/common/SmartSearch'

interface Subcategory {
  id: number
  name: string
  slug: string
}

interface NavCategory {
  id: number
  name: string
  slug: string
  navbar_order: number
  subcategories: Subcategory[]
}

// ⭐ Accept initialCategories from server (layout.tsx)
interface NavbarProps {
  initialCategories?: NavCategory[]
}

export default function Navbar({ initialCategories = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const { getQuoteCount } = useQuote()

  // ⭐ Use server-fetched categories directly - no useEffect, no loading!
  const categories = initialCategories

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Khaizan<span className="text-secondary">Solutions</span>
          </Link>

          {/* Smart Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SmartSearch />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/quote" className="relative hover:text-primary transition">
              <ShoppingCart size={28} />
              {getQuoteCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getQuoteCount()}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-8 py-3 border-t">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="text-gray-700 hover:text-primary font-medium transition flex items-center gap-1"
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>

                {/* Dropdown for Subcategories */}
                {category.subcategories &&
                 category.subcategories.length > 0 &&
                 activeDropdown === category.id && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/products?subcategory=${subcategory.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No categories available</p>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <SmartSearch onClose={() => setMobileMenuOpen(false)} />
            </div>

            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="block py-2 text-gray-700 hover:text-primary hover:bg-gray-100 px-4 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="pl-8 bg-gray-50">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/products?subcategory=${subcategory.slug}`}
                          className="block py-2 text-sm text-gray-600 hover:text-primary px-4"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm px-4">No categories available</p>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}