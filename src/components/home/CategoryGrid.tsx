import Link from 'next/link'
import { Sparkles, Package, Calendar } from 'lucide-react'

export default function ProductTypeCards() {
  const productTypes = [
    {
      name: 'New Products',
      icon: Sparkles,
      color: 'bg-blue-100 text-blue-600',
      slug: 'products?product_type=new',
      description: 'Latest arrivals in our store'
    },
    {
      name: 'Refurbished Products',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      slug: 'products?product_type=refurbished',
      description: 'Quality products at great prices'
    },
    {
      name: 'Rental Products',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
      slug: 'products?product_type=rental',
      description: 'Rent equipment for your projects'
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Product Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productTypes.map((type) => (
          <Link
            key={type.name}
            href={`/${type.slug}`}
            className="group"
          >
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center">
              <div className={`${type.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition`}>
                <type.icon size={40} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}