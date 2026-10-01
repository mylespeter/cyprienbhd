

// import { site } from '../data/site';
// import { getAllArticles, formatDate } from '../lib/articles';
// import HomeClient from './HomeClient';

// export default function Home() {
//   const articles = getAllArticles().map((a) => ({
//     slug: a.slug,
//     title: a.title,
//     excerpt: a.excerpt,
//     cover: a.cover,
//     dateLabel: formatDate(a.date),
//   }));

//   return <HomeClient site={site} articles={articles} />;
// }

import { site } from '../data/site';
import { getAllArticles, formatDate } from '../lib/articles';
import HomeClient from './HomeClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyprienbhd.com';

/* ---------- FAQ dédiée AEO (réponses directes pour assistants IA) ---------- */
const faq = [
  {
    q: "Qui est Cyprien Buhendwa ?",
    a: "Cyprien Buhendwa est un ingénieur agronome et éleveur basé à Goma, en République Démocratique du Congo. Il accompagne les exploitations agricoles et les élevages dans l'amélioration de leurs performances, du diagnostic de sol à la conduite d'élevage.",
  },
  {
    q: "Quels services propose Cyprien Buhendwa ?",
    a: "Il propose du conseil agronomique, du diagnostic de fertilité des sols, des plans de fertilisation, de l'accompagnement en élevage (aviculture notamment), et des formations pour exploitants et techniciens en RDC.",
  },
  {
    q: "Où intervient-il ?",
    a: "Cyprien Buhendwa est basé à Goma, dans la province du Nord-Kivu en RDC. Il intervient dans toute la région et peut accompagner à distance pour certains diagnostics.",
  },
  {
    q: "Quelle est sa formation ?",
    a: "Il est diplômé ingénieur agronome de l'Université Évangélique en Afrique (UEA), avec un cursus axé sur les sciences du sol, l'eau et l'environnement (2020-2025).",
  },
  {
    q: "Comment le contacter ?",
    a: `Par email à ${site.email} ou par téléphone au ${site.phone}. Il est également présent sur LinkedIn, Facebook et Telegram.`,
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export const metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
  alternates: { canonical: '/' },
};

export default function Home() {
  const articles = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    cover: a.cover,
    dateLabel: formatDate(a.date),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient site={site} articles={articles} />
    </>
  );
}