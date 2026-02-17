'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, ShoppingCart, Package } from 'lucide-react'
import { useQuote } from '@/context/QuoteContext'

export default function QuotePage() {
  const { quoteItems, removeFromQuote, updateQuantity, clearQuote } = useQuote()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateWhatsAppMessage = () => {
    let message = `*Request for Quotation*\n\n`
    message += `Name: ${formData.name}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.company) message += `Company: ${formData.company}\n`
    message += `\n*Products:*\n\n`
    quoteItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Qty: ${item.quantity}\n`
      message += `   Price: AED ${item.price.toFixed(2)}\n`
      message += `   Subtotal: AED ${(item.price * item.quantity).toFixed(2)}\n\n`
    })
    const total = quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    message += `*Total: AED ${total.toFixed(2)}*\n\n`
    if (formData.message) message += `Note:\n${formData.message}`
    return message
  }

  const handleWhatsAppSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in Name and Phone number')
      return
    }
    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/971507262269?text=${encodeURIComponent(message)}`, '_blank')
    setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    clearQuote()
    setShowForm(false)
  }

  const total = quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQty = quoteItems.reduce((sum, item) => sum + item.quantity, 0)

  // ── Empty State ──
  if (quoteItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShoppingCart size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Quote List is Empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add products to request a quotation</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32 md:pb-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4">

        {/* ── Header ── */}
        <Link href="/products" className="inline-flex items-center gap-1.5 text-blue-600 text-sm mb-3 hover:underline">
          <ArrowLeft size={15} /> Continue Shopping
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Request Quotation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Product List ── */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">
                Selected Products <span className="text-gray-400">({quoteItems.length})</span>
              </p>
              <button onClick={clearQuote} className="text-xs text-red-500 hover:text-red-700 font-medium">
                Clear All
              </button>
            </div>

            {quoteItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Package size={20} className="text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <button onClick={() => removeFromQuote(item.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.category}</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">AED {item.price.toFixed(2)}</p>

                  {/* Qty + Subtotal */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary & Form ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-4 lg:sticky lg:top-24">
              <h2 className="text-sm font-bold text-gray-800 mb-3">Quote Summary</h2>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span className="font-semibold text-gray-800">{quoteItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Qty</span>
                  <span className="font-semibold text-gray-800">{totalQty}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold text-gray-800">Est. Total</span>
                  <span className="font-bold text-blue-600">AED {total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 mb-4">*Final price confirmed in quotation</p>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Request Quotation
                </button>
              ) : (
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-gray-800">Your Details</h3>

                  {[
                    { name: 'name', placeholder: 'Full Name *', type: 'text' },
                    { name: 'email', placeholder: 'Email', type: 'email' },
                    { name: 'phone', placeholder: 'Phone Number *', type: 'tel' },
                    { name: 'company', placeholder: 'Company (Optional)', type: 'text' },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                    />
                  ))}

                  <textarea
                    name="message"
                    placeholder="Additional notes..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
                  />

                  <button
                    onClick={handleWhatsAppSubmit}
                    className="w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    Send via WhatsApp
                  </button>

                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full text-gray-400 hover:text-gray-600 py-1.5 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 px-3 py-2.5 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{totalQty} items · Est. total</span>
          <span className="text-sm font-bold text-blue-600">AED {total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <MessageCircle size={15} />
          Request Quotation via WhatsApp
        </button>
      </div>
    </div>
  )
}