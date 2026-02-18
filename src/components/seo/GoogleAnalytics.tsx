// src/components/seo/GoogleAnalytics.tsx
import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-TQVNE7PP3T'

export default function GoogleAnalytics() {
  return (
    <>
      {/* ✅ Load GA4 script — lazyOnload so it never blocks page render */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}