import { Truck, RotateCcw, MessageCircle, Tag, Award, Headphones } from 'lucide-react'

const reasons = [
  {
    icon: Truck,
    title: 'Fast UAE Delivery',
    desc: 'Same day & next day delivery across Dubai, Abu Dhabi, Sharjah and all UAE emirates.',
  },
  {
    icon: RotateCcw,
    title: 'New, Refurbished & Rental',
    desc: 'Every budget covered — buy new, save with refurbished, or rent for short-term needs.',
  },
  {
    icon: Tag,
    title: 'Best Prices in UAE',
    desc: 'Competitive pricing on all office supplies, furniture and equipment. No hidden costs.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    desc: 'All products tested and inspected. Warranty included on new and refurbished items.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    desc: 'Quick responses on WhatsApp. Get a free quote in minutes — call or message anytime.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Service',
    desc: 'Personalized service for businesses of all sizes across Dubai and the UAE.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="px-3 sm:px-4 py-6 bg-gray-50">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-800">Why Choose Khaizan Solutions?</h2>
        <p className="text-xs text-gray-500 mt-0.5">Dubai's trusted office supplies partner</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {reasons.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-primary hover:shadow-sm transition-all duration-200"
          >
            <div className="bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center mb-2.5">
              <Icon size={15} className="text-primary" />
            </div>
            <h3 className="text-xs font-semibold text-gray-800 mb-1 leading-tight">{title}</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed hidden sm:block">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}