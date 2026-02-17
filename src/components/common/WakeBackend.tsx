'use client'

import { useEffect } from 'react'

// Pings the backend on app load to wake Render free tier from sleep
export default function WakeBackend() {
  useEffect(() => {
    fetch('https://khaizan-backend.onrender.com/api/products/?page_size=1')
      .catch(() => {}) // Silent — just waking it up
  }, [])

  return null
}