import { getAllArticles } from '../lib/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyprienbhd.com';

export default function sitemap() {
  const articles = getAllArticles().map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...articles,
  ];
}