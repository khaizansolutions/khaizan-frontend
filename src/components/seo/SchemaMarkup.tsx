import Script from 'next/script'

export default function SchemaMarkup() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.khaizansolution.com/#business',
    name: 'Khaizan Solutions',
    alternateName: 'KhaizanSolutions',
    description:
      'Khaizan Solutions is Dubai\'s trusted supplier of new, refurbished, and rental office supplies, furniture, and equipment. Serving businesses across UAE with competitive prices and fast delivery.',
    url: 'https://www.khaizansolution.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.khaizansolution.com/logo.png',
      width: 200,
      height: 60,
    },
    image: 'https://www.khaizansolution.com/og-image.jpg',
    telephone: '+971507262269',
    email: 'khaizanstoragesolution@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Abu Dhabi' },
      { '@type': 'City', name: 'Sharjah' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/khaizan',
      'https://www.instagram.com/khaizan',
      'https://www.linkedin.com/company/khaizan',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Office Supplies & Equipment',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Office Supplies' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Office Equipment' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Office Equipment Rental' } },
      ],
    },
    priceRange: 'AED 10 - AED 10,000',
    currenciesAccepted: 'AED',
    paymentAccepted: 'Cash, Bank Transfer',
    knowsLanguage: ['en', 'ar'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.khaizansolution.com/#website',
    name: 'Khaizan Solutions',
    url: 'https://www.khaizansolution.com',
    description: 'Office supplies, furniture & equipment in Dubai, UAE',
    publisher: {
      '@id': 'https://www.khaizansolution.com/#business',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.khaizansolution.com/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.khaizansolution.com/#organization',
    name: 'Khaizan Solutions',
    url: 'https://www.khaizansolution.com',
    logo: 'https://www.khaizansolution.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971507262269',
      contactType: 'customer service',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
  }

  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  )
}