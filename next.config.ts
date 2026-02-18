import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // ✅ SEO FIX: Added Cloudinary (product images)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // ✅ SEO FIX: Added Render backend (fallback images)
      {
        protocol: 'https',
        hostname: 'khaizan-backend.onrender.com',
      },
    ],
  },
  output: 'standalone',
  productionBrowserSourceMaps: false,
}

export default nextConfig