import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              <span className="text-primary">Khaizan</span>
              <span className="text-white">Solutions</span>
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Dubai's trusted supplier of office supplies, furniture & equipment.
              New, refurbished & rental options across UAE.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/khaizan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="https://www.twitter.com/khaizan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="https://www.instagram.com/khaizan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/company/khaizan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Products — SEO keyword links */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Office Supplies</Link></li>
              <li><Link href="/rental" className="text-gray-400 hover:text-white transition-colors">Office Equipment Rental</Link></li>
              <li><Link href="/refurbished" className="text-gray-400 hover:text-white transition-colors">Refurbished Equipment</Link></li>
              <li><Link href="/products?product_type=new" className="text-gray-400 hover:text-white transition-colors">New Products</Link></li>
              <li><Link href="/products?category=furniture" className="text-gray-400 hover:text-white transition-colors">Office Furniture</Link></li>
              <li><Link href="/products?category=printers" className="text-gray-400 hover:text-white transition-colors">Printers & Copiers</Link></li>
              <li><Link href="/products?category=stationery" className="text-gray-400 hover:text-white transition-colors">Stationery</Link></li>
            </ul>
          </div>

          {/* Locations — SEO location links */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">We Deliver To</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Dubai</span></li>
              <li><span className="text-gray-400">Abu Dhabi</span></li>
              <li><span className="text-gray-400">Sharjah</span></li>
              <li><span className="text-gray-400">Ajman</span></li>
              <li><span className="text-gray-400">Ras Al Khaimah</span></li>
              <li><span className="text-gray-400">Fujairah</span></li>
              <li><span className="text-gray-400">All UAE Emirates</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">Contact</h4>
            <address className="not-italic space-y-3 text-sm">
              <a href="tel:+971507262269" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone size={14} className="text-primary shrink-0" />
                +971 50 726 2269
              </a>
              <a href="mailto:khaizanstoragesolution@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors break-all">
                <Mail size={14} className="text-primary shrink-0" />
                khaizanstoragesolution@gmail.com
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} className="text-primary shrink-0" />
                Dubai, UAE
              </div>
              <a
                href="https://wa.me/971507262269"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors mt-1"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.845L.057 23.547a.5.5 0 0 0 .609.61l5.82-1.527A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.204-1.431l-.373-.22-3.853 1.011 1.029-3.76-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp Us
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Khaizan Solutions. All rights reserved.</p>
          <p>Office Supplies · Furniture · Equipment · Rental · Refurbished · Dubai UAE</p>
        </div>
      </div>
    </footer>
  )
}