
// import { Bitter, Public_Sans } from 'next/font/google';
// import './globals.css';
// import { site } from '../data/site';

// const serif = Bitter({ subsets: ['latin'], variable: '--serif', display: 'swap' });
// const sans = Public_Sans({ subsets: ['latin'], variable: '--sans', display: 'swap' });

// export const metadata = {
//   title: `${site.name}, ${site.role.toLowerCase()}`,
//   description: site.intro,
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="fr" className={`${serif.variable} ${sans.variable} max-w-5xl mx-auto`}>
//       <body>{children}</body>
//     </html>
//   );
// }


import { Bitter, Public_Sans } from 'next/font/google';
import './globals.css';
import { site } from '../data/site';

const serif = Bitter({ subsets: ['latin'], variable: '--serif', display: 'swap' });
const sans = Public_Sans({ subsets: ['latin'], variable: '--sans', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyprienbhd.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.intro,
  keywords: [
    'ingénieur agronome',
    'agronome Goma',
    'élevage RDC',
    'conseil agricole Nord-Kivu',
    'fertilité des sols',
    'aviculture Goma',
    'formation agricole RDC',
    'Cyprien Buhendwa',
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.intro,
    locale: 'fr_FR',
    images: [
      {
        url: site.photo,
        width: 1200,
        height: 630,
        alt: `${site.name}, ${site.role}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.intro,
    images: [site.photo],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  category: 'Agriculture',
};

/* ---------- JSON-LD global : Person + WebSite + ProfessionalService ---------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: site.name,
      alternateName: 'Cyprien BHD',
      jobTitle: site.role,
      description: site.intro,
      image: `${SITE_URL}${site.photo}`,
      url: SITE_URL,
      email: `mailto:${site.email}`,
      telephone: site.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Goma',
        addressRegion: 'Nord-Kivu',
        addressCountry: 'CD',
      },
      knowsAbout: [
        'Agronomie',
        'Élevage',
        'Fertilité des sols',
        'Irrigation',
        'Aviculture',
        'Conseil agricole',
        'Formation agricole',
      ],
      sameAs: site.links.map((l) => l.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: site.name,
      description: site.intro,
      inLanguage: 'fr-FR',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: `${site.name} — Conseil agronome`,
      description:
        "Conseil agricole, élevage et formation pour les exploitations en RDC. Diagnostic de parcelle, plans de fertilisation, accompagnement d'éleveurs.",
      url: SITE_URL,
      image: `${SITE_URL}${site.photo}`,
      telephone: site.phone,
      email: site.email,
      priceRange: '$$',
      areaServed: [
        { '@type': 'Country', name: 'République Démocratique du Congo' },
        { '@type': 'AdministrativeArea', name: 'Nord-Kivu' },
        { '@type': 'City', name: 'Goma' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Goma',
        addressRegion: 'Nord-Kivu',
        addressCountry: 'CD',
      },
      founder: { '@id': `${SITE_URL}/#person` },
      serviceType: [
        'Conseil agronomique',
        'Diagnostic de sol',
        'Plan de fertilisation',
        'Accompagnement en élevage',
        'Formation agricole',
      ],
      sameAs: site.links.map((l) => l.href),
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="max-w-5xl mx-auto">{children}</body>
    </html>
  );
}