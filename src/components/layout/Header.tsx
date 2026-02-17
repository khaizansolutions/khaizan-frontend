'use client'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Header() {
  return (
    <div className="bg-primary text-white py-2 px-3 md:px-4">
      <div className="container mx-auto flex justify-between items-center text-xs md:text-sm">
        {/* Contact Info */}
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="tel:+971544706523"
            className="flex items-center gap-1 md:gap-2 hover:text-secondary transition"
          >
            <Phone size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">+971 544 706 523</span>
            <span className="sm:hidden">Call</span>
          </a>
          <a
            href="mailto:khaizanstoragesolutions@gmail.com"
            className="flex items-center gap-1 md:gap-2 hover:text-secondary transition"
          >
            <Mail size={14} className="md:w-4 md:h-4" />
            <span className="hidden lg:inline">khaizanstoragesolutions@gmail.com</span>
            <span className="lg:hidden hidden sm:inline">Email</span>
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 md:gap-2">
          <MapPin size={14} className="md:w-4 md:h-4" />
          <span className="hidden md:inline">Dubai, UAE</span>
          <span className="md:hidden">Dubai</span>
        </div>
      </div>
    </div>
  )
}