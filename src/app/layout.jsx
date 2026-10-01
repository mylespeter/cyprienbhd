

// import { Bitter, Public_Sans } from 'next/font/google';
// import './globals.css';
// import { site } from '../data/site';

// const serif = Bitter({ subsets: ['latin'], variable: '--serif', display: 'swap' });
// const sans = Public_Sans({ subsets: ['latin'], variable: '--sans', display: 'swap' });

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyprienbhd.vercel.app';

// export const metadata = {
//   metadataBase: new URL(SITE_URL),

//   title: {
//     default: `${site.name} — ${site.role}`,
//     template: `%s | ${site.name}`,
//   },
//   description: site.intro,
//   keywords: [
//     'ingénieur agronome',
//     'agronome Goma',
//     'élevage RDC',
//     'conseil agricole Nord-Kivu',
//     'fertilité des sols',
//     'aviculture Goma',
//     'formation agricole RDC',
//     'Cyprien Buhendwa',
//   ],
//   authors: [{ name: site.name, url: SITE_URL }],
//   creator: site.name,
//   publisher: site.name,

//   alternates: { canonical: '/' },

//   openGraph: {
//     type: 'website',
//     url: SITE_URL,
//     siteName: site.name,
//     title: `${site.name} — ${site.role}`,
//     description: site.intro,
//     locale: 'fr_FR',
//     images: [
//       {
//         url: site.photo,
//         width: 1200,
//         height: 630,
//         alt: `${site.name}, ${site.role}`,
//       },
//     ],
//   },

//   twitter: {
//     card: 'summary_large_image',
//     title: `${site.name} — ${site.role}`,
//     description: site.intro,
//     images: [site.photo],
//   },

//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//       'max-video-preview': -1,
//     },
//   },

//   icons: {
//     icon: '/favicon.ico',
//     apple: '/apple-touch-icon.png',
//   },

//   verification: {
//     google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
//   },

//   category: 'Agriculture',
// };

// /* ---------- JSON-LD global : Person + WebSite + ProfessionalService ---------- */
// const jsonLd = {
//   '@context': 'https://schema.org',
//   '@graph': [
//     {
//       '@type': 'Person',
//       '@id': `${SITE_URL}/#person`,
//       name: site.name,
//       alternateName: 'Cyprien BHD',
//       jobTitle: site.role,
//       description: site.intro,
//       image: `${SITE_URL}${site.photo}`,
//       url: SITE_URL,
//       email: `mailto:${site.email}`,
//       telephone: site.phone,
//       address: {
//         '@type': 'PostalAddress',
//         addressLocality: 'Goma',
//         addressRegion: 'Nord-Kivu',
//         addressCountry: 'CD',
//       },
//       knowsAbout: [
//         'Agronomie',
//         'Élevage',
//         'Fertilité des sols',
//         'Irrigation',
//         'Aviculture',
//         'Conseil agricole',
//         'Formation agricole',
//       ],
//       sameAs: site.links.map((l) => l.href),
//     },
//     {
//       '@type': 'WebSite',
//       '@id': `${SITE_URL}/#website`,
//       url: SITE_URL,
//       name: site.name,
//       description: site.intro,
//       inLanguage: 'fr-FR',
//       publisher: { '@id': `${SITE_URL}/#person` },
//     },
//     {
//       '@type': 'ProfessionalService',
//       '@id': `${SITE_URL}/#service`,
//       name: `${site.name} — Conseil agronome`,
//       description:
//         "Conseil agricole, élevage et formation pour les exploitations en RDC. Diagnostic de parcelle, plans de fertilisation, accompagnement d'éleveurs.",
//       url: SITE_URL,
//       image: `${SITE_URL}${site.photo}`,
//       telephone: site.phone,
//       email: site.email,
//       priceRange: '$$',
//       areaServed: [
//         { '@type': 'Country', name: 'République Démocratique du Congo' },
//         { '@type': 'AdministrativeArea', name: 'Nord-Kivu' },
//         { '@type': 'City', name: 'Goma' },
//       ],
//       address: {
//         '@type': 'PostalAddress',
//         addressLocality: 'Goma',
//         addressRegion: 'Nord-Kivu',
//         addressCountry: 'CD',
//       },
//       founder: { '@id': `${SITE_URL}/#person` },
//       serviceType: [
//         'Conseil agronomique',
//         'Diagnostic de sol',
//         'Plan de fertilisation',
//         'Accompagnement en élevage',
//         'Formation agricole',
//       ],
//       sameAs: site.links.map((l) => l.href),
//     },
//   ],
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
//       <head>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//         />
//       </head>
//       <body className="max-w-5xl mx-auto">{children}</body>
//     </html>
//   );
// }
import { Bitter, Public_Sans } from 'next/font/google';
import './globals.css';
import { site } from '../data/site';

const serif = Bitter({ subsets: ['latin'], variable: '--serif', display: 'swap' });
const sans = Public_Sans({ subsets: ['latin'], variable: '--sans', display: 'swap' });

/* ============================================================
   TOUT EST STATIQUE ICI — URL, TITRE, DESCRIPTION, IMAGE
   ============================================================ */

const SITE_URL = 'https://cyprienbhd.vercel.app';

const SITE_NAME = 'Cyprien Buhendwa';
const SITE_ROLE = 'Ingénieur agronome & éleveur';
const SITE_TITLE = 'Cyprien Buhendwa — Ingénieur agronome & éleveur';
const SITE_DESCRIPTION =
  "Ingénieur agronome à Goma, RDC. Conseil agricole, élevage et formation pour des exploitations plus performantes.";

const OG_IMAGE_URL = 'https://cyprienbhd.vercel.app/profile_cyprien_kalugura.jpg';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT = 'Cyprien Buhendwa, Ingénieur agronome & éleveur';
const OG_IMAGE_TYPE = 'image/jpeg';

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'fr_FR',
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
        type: OG_IMAGE_TYPE,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
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
      name: SITE_NAME,
      alternateName: 'Cyprien BHD',
      jobTitle: SITE_ROLE,
      description: SITE_DESCRIPTION,
      image: OG_IMAGE_URL,
      url: SITE_URL,
      email: 'mailto:contact@cyprienbhd.com',
      telephone: '+243 995 193 497',
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
      sameAs: [
        'https://www.linkedin.com/in/cyprienbhd',
        'https://www.facebook.com/cyprienbhd',
        'https://t.me/cyprienbhd',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'fr-FR',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: `${SITE_NAME} — Conseil agronome`,
      description:
        "Conseil agricole, élevage et formation pour les exploitations en RDC. Diagnostic de parcelle, plans de fertilisation, accompagnement d'éleveurs.",
      url: SITE_URL,
      image: OG_IMAGE_URL,
      telephone: '+243 995 193 497',
      email: 'contact@cyprienbhd.com',
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
      sameAs: [
        'https://www.linkedin.com/in/cyprienbhd',
        'https://www.facebook.com/cyprienbhd',
        'https://t.me/cyprienbhd',
      ],
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