import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '../../../data/site';
import { getAllArticles, getArticle, formatDate } from '../../../lib/articles';
import { FaGithub, FaTwitter, FaLinkedin, FaResearchgate, FaFacebook, FaTelegram } from 'react-icons/fa';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

/* =====================================================================
   SEO — Metadata complète
   ===================================================================== */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ton-domaine.com';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};

  const url = `${SITE_URL}/articles/${a.slug}`;
  const description = a.excerpt || a.title;
  const image = a.cover
    ? a.cover.startsWith('http')
      ? a.cover
      : `${SITE_URL}${a.cover}`
    : `${SITE_URL}/og-default.jpg`;

  return {
    title: `${a.title} | ${site.name}`,
    description,
    keywords: a.keywords || [site.role, 'agriculture', 'agronomie', site.name],
    authors: [{ name: site.name, url: SITE_URL }],
    creator: site.name,
    publisher: site.name,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: 'article',
      url,
      title: a.title,
      description,
      siteName: site.name,
      locale: 'fr_FR',
      publishedTime: a.date ? new Date(a.date).toISOString() : undefined,
      modifiedTime: a.date ? new Date(a.date).toISOString() : undefined,
      authors: [site.name],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: a.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description,
      images: [image],
      creator: site.twitterHandle || undefined,
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
  };
}

/* =====================================================================
   Icônes sociales
   ===================================================================== */
const socialIcons = {
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  researchgate: FaResearchgate,
  facebook: FaFacebook,
  telegram: FaTelegram,
};
const iconFor = (l) =>
  socialIcons[l.icon] || socialIcons[l.label?.toLowerCase()] || FaTwitter;

/* =====================================================================
   Page
   ===================================================================== */
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  const all = getAllArticles();
  const index = all.findIndex((x) => x.slug === slug);
  const next = index >= 0 ? all[(index + 1) % all.length] : null;

  const url = `${SITE_URL}/articles/${a.slug}`;
  const image = a.cover
    ? a.cover.startsWith('http')
      ? a.cover
      : `${SITE_URL}${a.cover}`
    : `${SITE_URL}/og-default.jpg`;

  /* ---------- JSON-LD : BlogPosting + Breadcrumb ---------- */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': url,
        headline: a.title,
        description: a.excerpt,
        image: [image],
        datePublished: a.date ? new Date(a.date).toISOString() : undefined,
        dateModified: a.date ? new Date(a.date).toISOString() : undefined,
        author: {
          '@type': 'Person',
          name: site.name,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Person',
          name: site.name,
          url: SITE_URL,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        inLanguage: 'fr-FR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Publications',
            item: `${SITE_URL}/#publications`,
          },
          { '@type': 'ListItem', position: 3, name: a.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="max-w-5xl mx-auto pt-4 px-6 pb-24">
      {/* ---------- JSON-LD ---------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- Retour sticky ---------- */}
      <nav
        aria-label="Fil d'Ariane"
        className="sticky top-0 z-30 -mx-6 mb-6 border-b border-line bg-bg/90 px-6 py-3 backdrop-blur-sm"
      >
        <Link
          href="/#publications"
          className="text-[.92rem] text-muted no-underline hover:underline
                     underline-offset-[5px] decoration-gold"
        >
          ← Retour aux publications
        </Link>
      </nav>

      {/* ---------- Titre + méta ---------- */}
      <header>
        <h1
          className="custom-serif font-semibold leading-tight tracking-[-.015em]
                     text-[clamp(2rem,5.5vw,3rem)] mt-3 mb-3"
        >
          {a.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[.9rem] text-muted">
          {a.date && (
            <time dateTime={new Date(a.date).toISOString()}>
              {formatDate(a.date)}
            </time>
          )}
          {a.date && <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />}
          <span itemProp="author">{site.name}</span>
        </div>
      </header>

      {/* ---------- Cover ---------- */}
      {a.cover && (
        <img
          src={a.cover}
          alt={`Illustration de l'article : ${a.title}`}
          width={1200}
          height={514}
          loading="eager"
          fetchPriority="high"
          className="w-full aspect-[24/9] object-cover mt-6 mb-2"
        />
      )}

      {/* ---------- Contenu ---------- */}
      <div
        className="mt-6
                   [&_h2]:custom-serif [&_h2]:font-semibold [&_h2]:leading-tight
                   [&_h2]:text-[1.6rem] [&_h2]:mt-[2em] [&_h2]:mb-[.4em]
                   [&_h3]:custom-serif [&_h3]:font-semibold [&_h3]:text-[1.25rem]
                   [&_h3]:mt-[1.6em] [&_h3]:mb-[.3em]
                   [&_p]:my-[1em] [&_ul]:my-[1em] [&_ol]:my-[1em]
                   [&_ul]:list-disc [&_ul]:pl-[1.3em] [&_ol]:list-decimal [&_ol]:pl-[1.3em]
                   [&_img]:w-full [&_img]:my-[1.8em]
                   [&_blockquote]:border-l-[3px] [&_blockquote]:border-gold
                   [&_blockquote]:pl-[18px] [&_blockquote]:my-[1.6em]
                   [&_blockquote]:text-muted
                   [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-[3px]"
        dangerouslySetInnerHTML={{ __html: a.html ?? '' }}
      />

      {/* ---------- Partage / Réseaux sociaux ---------- */}
      <footer className="mt-14 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-6">
        <p className="text-[.85rem] text-muted">Partager cet article</p>
        <div className="flex flex-wrap gap-3" aria-label="Partager sur les réseaux sociaux">
          {site.links?.map((l) => {
            const Icon = iconFor(l);
            return (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.label} — ${site.name}`}
                title={l.label}
                className="flex h-10 w-10 items-center justify-center rounded-full
                           border border-line text-green transition-colors duration-300
                           hover:border-green hover:bg-green-700 hover:text-white"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </footer>

      {/* ---------- Article suivant ---------- */}
      {next && next.slug !== slug && (
        <Link
          href={`/articles/${next.slug}`}
          rel="next"
          aria-label={`Article suivant : ${next.title}`}
          className="group mt-10 block border border-line px-6 py-6 no-underline
                     transition-colors duration-300 hover:border-green"
        >
          <p className="mb-2 text-[.8rem] uppercase tracking-[.14em] text-muted">
            Article suivant
          </p>
          <h3 className="custom-serif text-[1.35rem] font-semibold leading-tight text-ink
                         transition-colors duration-300 group-hover:text-green">
            {next.title}
            <span
              aria-hidden
              className="ml-2 inline-block transition-transform duration-300
                         group-hover:translate-x-1"
            >
              →
            </span>
          </h3>
          {next.excerpt && (
            <p className="mt-2 max-w-[60ch] text-[.95rem] text-muted">{next.excerpt}</p>
          )}
        </Link>
      )}
    </article>
  );
}