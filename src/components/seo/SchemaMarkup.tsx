import Script from 'next/script'

export default function SchemaMarkup() {
  const SITE_URL = 'https://www.khaizansolution.com'
  const LOGO_URL = `${SITE_URL}/KHAIZAN-SOLUTION.png`
  const OG_IMAGE = `${SITE_URL}/og-image.jpg`

  const UAE_AREAS = [
    // Dubai
    'Dubai', 'Downtown Dubai', 'Business Bay', 'Dubai Marina', 'JLT', 'DIFC',
    'Deira', 'Bur Dubai', 'Al Quoz', 'Al Barsha', 'Jumeirah', 'Dubai Silicon Oasis',
    'Dubai Investment Park', 'Jebel Ali', 'Dubai South', 'Al Nahda Dubai',
    'Mirdif', 'Dubai Festival City', 'Dubai Internet City', 'Dubai Media City',
    'Dubai Knowledge Park', 'Dubai Production City', 'Al Qusais', 'Al Karama',
    'Al Garhoud', 'Al Rashidiya', 'Dubai Hills', 'Motor City', 'Sports City',
    // Abu Dhabi
    'Abu Dhabi', 'Al Reem Island', 'Khalifa City', 'Mohammed Bin Zayed City',
    'Al Mushrif', 'Al Nahyan', 'Mussafah', 'ADNEC', 'Al Maryah Island',
    'Yas Island', 'Saadiyat Island', 'Al Ain',
    // Sharjah
    'Sharjah', 'Al Nahda Sharjah', 'Industrial Area Sharjah', 'Muwaileh',
    'Al Majaz', 'Al Taawun', 'Al Khan',
    // Other Emirates
    'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain',
  ]

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    '@id': `${SITE_URL}/#business`,
    name: 'Khaizan Solutions',
    alternateName: [
      'Khaizan Office Supplies',
      'Khaizan Office Furniture Dubai',
      'Khaizan Office Equipment UAE',
    ],
    description:
      "Khaizan Solutions — Dubai's #1 supplier of new, refurbished & rental office supplies, furniture, printers, copiers, shredders, and stationery. Serving all areas of Dubai, Abu Dhabi, Sharjah and across UAE with competitive prices and fast delivery.",
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: OG_IMAGE,
    telephone: '+971507262269',
    email: 'khaizanstoragesolution@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    areaServed: UAE_AREAS.map(area => ({ '@type': 'City', name: area })),
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
      name: 'Office Supplies, Furniture & Equipment UAE',
      itemListElement: [
        // New
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Office Supplies Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Office Furniture Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Office Chairs Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Office Desks Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Printers Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Copiers Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'New Shredders Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Ink Cartridges Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Toner Cartridges Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Paper Products Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Stationery Supplies Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Writing Instruments Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Filing Storage Dubai' } },
        // Refurbished
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Office Furniture Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Office Chairs Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Printers Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Copiers Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Refurbished Laptops Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Second Hand Office Equipment Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Used Office Furniture UAE' } },
        // Rental
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Office Equipment Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Printer Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Copier Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Furniture Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Office Chair Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Laptop Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Projector Rental Dubai' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Display Screen Rental Dubai' } },
      ],
    },
    priceRange: 'AED 10 - AED 10,000',
    currenciesAccepted: 'AED',
    paymentAccepted: 'Cash, Bank Transfer, Credit Card',
    knowsLanguage: ['en', 'ar'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Khaizan Solutions',
    url: SITE_URL,
    description: 'Office supplies, furniture & equipment — new, refurbished & rental — Dubai, Abu Dhabi, Sharjah, UAE',
    publisher: { '@id': `${SITE_URL}/#business` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Khaizan Solutions',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971507262269',
      contactType: 'customer service',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
  }

  // ✅ FAQ schema — Google shows these as rich results directly in search
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I buy office supplies in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khaizan Solutions delivers office supplies across all Dubai areas including Business Bay, Deira, Al Quoz, JLT, DIFC, Al Barsha and more. Order at khaizansolution.com or call +971507262269.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Khaizan Solutions offer printer rental in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Khaizan Solutions offers printer and copier rental in Dubai, Abu Dhabi and Sharjah with flexible monthly plans.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I buy refurbished office furniture in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khaizan Solutions sells high-quality refurbished office chairs, desks and furniture across Dubai and UAE at competitive prices.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver office supplies to Abu Dhabi and Sharjah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Khaizan Solutions delivers to all UAE emirates — Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah and Fujairah. Free delivery on orders over AED 300.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I rent office furniture in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khaizan Solutions provides office furniture rental including chairs, desks and workstations in Dubai, Abu Dhabi and Sharjah with flexible short and long-term plans.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Khaizan sell ink and toner cartridges in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Khaizan Solutions stocks ink cartridges, toner cartridges and printer ribbons for all major brands, available for delivery across UAE.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I buy refurbished printers in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khaizan Solutions offers refurbished printers and copiers in Dubai at great prices. All refurbished units are tested and come with warranty.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Khaizan offer office furniture rental in Abu Dhabi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Khaizan Solutions provides office furniture and equipment rental in Abu Dhabi, including chairs, desks, printers and more.',
        },
      },
    ],
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
      <Script
        id="schema-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  )
}