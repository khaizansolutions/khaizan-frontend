import Link from 'next/link'
import { Sparkles, Package, Calendar, ArrowRight } from 'lucide-react'

export default function ProductTypeCards() {
  const productTypes = [
    {
      name: 'New Products',
      icon: Sparkles,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      arrowColor: 'text-blue-600',
      href: '/products?product_type=new',  // ⭐ Redirects to products with filter
      description: 'Latest arrivals in our store',
    },
    {
      name: 'Refurbished Products',
      icon: Package,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      arrowColor: 'text-green-600',
      href: '/products?product_type=refurbished',  // ⭐ Redirects to products with filter
      description: 'Quality products at great prices',
    },
    {
      name: 'Rental Products',
      icon: Calendar,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      arrowColor: 'text-purple-600',
      href: '/products?product_type=rental',  // ⭐ Redirects to products with filter
      description: 'Rent equipment for your projects',
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Product Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productTypes.map((type) => (
          <Link
            key={type.name}
            href={type.href}
            className="group"
          >
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className={`${type.iconBg} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <type.icon size={40} className={type.iconColor} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <div className={`flex items-center justify-center gap-1 text-sm font-semibold ${type.arrowColor} group-hover:gap-2 transition-all`}>
                Browse <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}