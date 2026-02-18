import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/quote/',      // no need to index cart/quote page
          '/_next/',
          '/admin/',
        ],
      },
      {
        // Block AI scrapers from training on your content
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.khaizan.com/sitemap.xml',
    host: 'https://www.khaizan.com',
  }
}