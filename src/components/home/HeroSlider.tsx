'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Quality Office Supplies',
      subtitle: 'Everything you need for your office',
      bg: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Fast Delivery',
      subtitle: 'Free delivery on orders over AED 300',
      bg: 'from-amber-500 to-orange-700',
    },
    {
      title: 'Best Prices',
      subtitle: 'Competitive prices guaranteed',
      bg: 'from-green-600 to-teal-700',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative h-[200px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-xl mx-3 sm:mx-4 mt-3">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-full flex items-center px-8 sm:px-12">
            <div className="text-white">
              {/* ✅ SEO FIX: Only active slide renders h1, inactive slides use div */}
              {index === currentSlide ? (
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 leading-tight">
                  {slide.title}
                </h1>
              ) : (
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 leading-tight" aria-hidden="true">
                  {slide.title}
                </div>
              )}
              <p className="text-sm sm:text-base text-white/80 mb-4">
                {slide.subtitle}
              </p>
              <button className="bg-white text-gray-900 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 active:scale-[0.97] transition-all">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-4 h-1.5' : 'bg-white/50 w-1.5 h-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}