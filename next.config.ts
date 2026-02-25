import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // ✅ Increase timeout for slow Render/Cloudinary responses
    minimumCacheTTL: 60,
    // ✅ Allow Cloudinary's auto format (no extension in URL)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'khaizan-backend.onrender.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  productionBrowserSourceMaps: false,
}

export default nextConfig