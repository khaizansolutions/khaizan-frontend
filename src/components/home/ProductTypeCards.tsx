import Link from 'next/link'
import { Sparkles, Package, Calendar, ArrowRight } from 'lucide-react'

export default function ProductTypeCards() {
  const productTypes = [
    {
      name: 'New Products',
      icon: Sparkles,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      href: '/products?product_type=new',
      description: 'Latest arrivals in store',
    },
    {
      name: 'Refurbished',
      icon: Package,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
      href: '/products?product_type=refurbished',
      description: 'Quality at great prices',
    },
    {
      name: 'Rental',
      icon: Calendar,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
      href: '/products?product_type=rental',
      description: 'Rent for your projects',
    },
  ]

  return (
    <section className="px-3 sm:px-4 py-5">
      <h2 className="text-base font-bold text-gray-800 mb-3">Shop by Type</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {productTypes.map((type) => (
          <Link key={type.name} href={type.href} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 text-center">
              <div className={`${type.iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                <type.icon size={20} className={type.iconColor} />
              </div>
              <h3 className="font-semibold text-gray-800 text-[11px] sm:text-xs mb-0.5 leading-tight">
                {type.name}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-gray-400 mb-2 leading-tight hidden sm:block">
                {type.description}
              </p>
              <div className={`flex items-center justify-center gap-0.5 text-[9px] sm:text-[10px] font-semibold ${type.textColor}`}>
                Browse <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}