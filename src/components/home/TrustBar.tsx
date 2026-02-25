import { Truck, RefreshCcw, MessageCircle, Shield } from 'lucide-react'

const trustItems = [
  { icon: Truck, text: 'Free Delivery', sub: 'Orders over AED 300' },
  { icon: RefreshCcw, text: 'New · Refurbished · Rental', sub: 'All options available' },
  { icon: Shield, text: 'Warranty Included', sub: 'On all products' },
  { icon: MessageCircle, text: 'WhatsApp Support', sub: 'Quick response' },
]

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-gray-100 px-3 sm:px-4 py-3 sm:py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trustItems.map(({ icon: Icon, text, sub }) => (
          <div key={text} className="flex items-center gap-2.5">
            <div className="bg-red-50 p-2 rounded-lg shrink-0">
              <Icon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight">{text}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}