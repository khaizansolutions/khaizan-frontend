'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, SlidersHorizontal, Check, Search, Trash2 } from 'lucide-react'

interface Category {
  id: string | number
  name: string
  count?: number
}

interface ProductFiltersProps {
  categories: Category[]
  selectedCategories: string[]
  priceRange: [number, number]
  maxPrice: number
  searchQuery: string
  onCategoryChange: (categoryId: string) => void
  onPriceChange: (range: [number, number]) => void
  onSearchChange: (query: string) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  productTypes?: Array<{ value: string; label: string; count?: number }>
  selectedProductTypes?: string[]
  onProductTypeChange?: (type: string) => void
}

export default function ProductFilters({
  categories,
  selectedCategories,
  priceRange,
  maxPrice,
  searchQuery,
  onCategoryChange,
  onPriceChange,
  onSearchChange,
  onClearFilters,
  productTypes = [],
  selectedProductTypes = [],
  onProductTypeChange,
}: ProductFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [minPrice, setMinPrice] = useState(priceRange[0])
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange[1])

  // Update local state when props change
  useEffect(() => {
    setMinPrice(priceRange[0])
    setMaxPriceInput(priceRange[1])
  }, [priceRange])

  // Memoize calculations
  const hasActiveFilters = useMemo(() =>
    selectedCategories.length > 0 ||
    selectedProductTypes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    searchQuery.length > 0,
    [selectedCategories, selectedProductTypes, priceRange, maxPrice, searchQuery]
  )

  const activeFilterCount = useMemo(() =>
    selectedCategories.length +
    selectedProductTypes.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (searchQuery.length > 0 ? 1 : 0),
    [selectedCategories, selectedProductTypes, priceRange, maxPrice, searchQuery]
  )

  const filteredCategories = useMemo(() =>
    categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    ),
    [categories, categorySearch]
  )

  const handlePriceApply = () => {
    // Only update if values changed
    if (minPrice !== priceRange[0] || maxPriceInput !== priceRange[1]) {
      onPriceChange([minPrice, maxPriceInput])
    }
  }

  const handleClearAll = () => {
    setCategorySearch('')
    setMinPrice(0)
    setMaxPriceInput(maxPrice)
    onClearFilters()
    setIsMobileOpen(false)
  }

  const FilterContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <p className="text-xs text-gray-500">{activeFilterCount} active</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Active Filters
              </p>
              <button
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id.toString() === catId)
                return cat ? (
                  <button
                    key={catId}
                    onClick={() => onCategoryChange(catId)}
                    className="bg-white border border-blue-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
                  >
                    {cat.name}
                    <X className="w-3 h-3" />
                  </button>
                ) : null
              })}
              {selectedProductTypes.map((type) => {
                const typeInfo = productTypes.find((t) => t.value === type)
                return typeInfo ? (
                  <button
                    key={type}
                    onClick={() => onProductTypeChange?.(type)}
                    className="bg-white border border-blue-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
                  >
                    {typeInfo.label}
                    <X className="w-3 h-3" />
                  </button>
                ) : null
              })}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice(0)
                    setMaxPriceInput(maxPrice)
                    onPriceChange([0, maxPrice])
                  }}
                  className="bg-white border border-blue-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
                >
                  AED {priceRange[0]}-{priceRange[1]}
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="bg-white border border-blue-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
                >
                  &quot;{searchQuery}&quot;
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="space-y-3">
          <label htmlFor="product-search" className="block text-sm font-bold text-gray-900">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="product-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, brand..."
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Product Type */}
        {productTypes.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-900">Product Type</label>
            <div className="grid grid-cols-2 gap-2">
              {productTypes.map((type) => {
                const isSelected = selectedProductTypes.includes(type.value)
                return (
                  <button
                    key={type.value}
                    onClick={() => onProductTypeChange?.(type.value)}
                    className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {type.label}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {type.count !== undefined && type.count > 0 && (
                      <span className="text-xs text-gray-500 mt-1 block">{type.count} items</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-3">
          <label htmlFor="category-search" className="block text-sm font-bold text-gray-900">
            Categories
          </label>

          {/* Category Search */}
          {categories.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="category-search"
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Filter categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
              />
            </div>
          )}

          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {filteredCategories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No categories found</p>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id.toString())
                return (
                  <label
                    key={category.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onCategoryChange(category.id.toString())}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                    </div>
                    {category.count !== undefined && category.count > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {category.count}
                      </span>
                    )}
                  </label>
                )
              })
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-900">Price Range</label>

          {/* Price Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="min-price" className="block text-xs text-gray-600 mb-1.5">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                  AED
                </span>
                <input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value))
                    setMinPrice(val)
                  }}
                  onBlur={handlePriceApply}
                  className="w-full pl-12 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                  min="0"
                  max={maxPriceInput}
                />
              </div>
            </div>
            <div>
              <label htmlFor="max-price" className="block text-xs text-gray-600 mb-1.5">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                  AED
                </span>
                <input
                  id="max-price"
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => {
                    const val = Math.min(maxPrice, Number(e.target.value))
                    setMaxPriceInput(val)
                  }}
                  onBlur={handlePriceApply}
                  className="w-full pl-12 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
            </div>
          </div>

          {/* Quick Price Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Under 100', value: [0, 100] as [number, number] },
              { label: 'Under 500', value: [0, 500] as [number, number] },
              { label: 'Under 1000', value: [0, 1000] as [number, number] },
              { label: 'All', value: [0, maxPrice] as [number, number] },
            ].map((preset) => {
              const isActive =
                priceRange[0] === preset.value[0] && priceRange[1] === preset.value[1]
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setMinPrice(preset.value[0])
                    setMaxPriceInput(preset.value[1])
                    onPriceChange(preset.value)
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer - Clear Filters Button */}
      {hasActiveFilters && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClearAll}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-6 h-6" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-[calc(100vh-8rem)]">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="md:hidden fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white shadow-2xl animate-slideInRight">
            <FilterContent />
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}