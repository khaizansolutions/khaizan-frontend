import HeroSlider from '@/components/home/HeroSlider'
import ProductTypeCards from '@/components/home/ProductTypeCards'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'

export default function Home() {
  return (
    <div>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Product Type Cards - 3 clickable cards (New, Refurbished, Rental) */}
      <ProductTypeCards />

      {/* 3. Category Grid - First 4 navbar categories */}
      <CategoryGrid />

      {/* 4. Featured Products */}
      <FeaturedProducts />
    </div>
  )
}