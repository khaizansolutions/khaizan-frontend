'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, SlidersHorizontal, Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

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

const TYPE_LABELS: Record<string, string> = {
  new: 'New',
  refurbished: 'Refurbished',
  rental: 'Rental',
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
  const [showAllCategories, setShowAllCategories] = useState(false)

  useEffect(() => {
    setMinPrice(priceRange[0])
    setMaxPriceInput(priceRange[1])
  }, [priceRange])

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

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

  const visibleCategories = showAllCategories ? filteredCategories : filteredCategories.slice(0, 6)

  const handlePriceApply = () => {
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
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span className="font-semibold text-sm text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash2 size={11} />
              Clear
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-5 py-4 space-y-6">

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5">
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id.toString() === catId)
                return cat ? (
                  <button
                    key={catId}
                    onClick={() => onCategoryChange(catId)}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    {cat.name} <X size={10} />
                  </button>
                ) : null
              })}
              {selectedProductTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onProductTypeChange?.(type)}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  {TYPE_LABELS[type] || type} <X size={10} />
                </button>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <button
                  onClick={() => { setMinPrice(0); setMaxPriceInput(maxPrice); onPriceChange([0, maxPrice]) }}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  AED {priceRange[0]}–{priceRange[1]} <X size={10} />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  &ldquo;{searchQuery}&rdquo; <X size={10} />
                </button>
              )}
            </div>
          )}

          {/* ── Search ── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Search</p>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Name, brand..."
                className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" aria-label="Clear search">
                  <X size={13} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* ── Product Type ── */}
          {productTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Type</p>
              <div className="space-y-1">
                {productTypes.map((type) => {
                  const isSelected = selectedProductTypes.includes(type.value)
                  return (
                    <button
                      key={type.value}
                      onClick={() => onProductTypeChange?.(type.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{TYPE_LABELS[type.value] || type.value}</span>
                      {type.count !== undefined && (
                        <span className={`text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                          {type.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Categories ── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Category</p>

            {categories.length > 6 && (
              <div className="relative mb-2">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-blue-400 outline-none bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            )}

            <div className="space-y-0.5">
              {visibleCategories.length === 0 ? (
                <p className="text-xs text-gray-400 py-2 text-center">No categories found</p>
              ) : (
                visibleCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id.toString())
                  return (
                    <label
                      key={category.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onCategoryChange(category.id.toString())}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      {category.count !== undefined && category.count > 0 && (
                        <span className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                          {category.count}
                        </span>
                      )}
                    </label>
                  )
                })
              )}
            </div>

            {filteredCategories.length > 6 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAllCategories ? (
                  <><ChevronUp size={12} /> Show less</>
                ) : (
                  <><ChevronDown size={12} /> Show {filteredCategories.length - 6} more</>
                )}
              </button>
            )}
          </div>

          {/* ── Price Range ── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Price (AED)</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Min</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                  onBlur={handlePriceApply}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  min="0"
                  max={maxPriceInput}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Max</label>
                <input
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(Math.min(maxPrice, Number(e.target.value)))}
                  onBlur={handlePriceApply}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  min={minPrice}
                  max={maxPrice}
                  placeholder={maxPrice.toString()}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '< 100', value: [0, 100] as [number, number] },
                { label: '< 500', value: [0, 500] as [number, number] },
                { label: '< 1000', value: [0, 1000] as [number, number] },
                { label: 'All', value: [0, maxPrice] as [number, number] },
              ].map((preset) => {
                const isActive = priceRange[0] === preset.value[0] && priceRange[1] === preset.value[1]
                return (
                  <button
                    key={preset.label}
                    onClick={() => { setMinPrice(preset.value[0]); setMaxPriceInput(preset.value[1]); onPriceChange(preset.value) }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 h-12 px-4 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-white text-blue-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-24 bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
          <FilterContent />
        </div>
      </aside>

      {/* ── Mobile Drawer ── */}
      {isMobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 right-0 w-full max-w-xs z-50 bg-white shadow-2xl flex flex-col">
            <FilterContent />
          </div>
        </>
      )}
    </>
  )
}