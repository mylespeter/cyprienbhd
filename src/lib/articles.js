
// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';
// import { remark } from 'remark';
// import html from 'remark-html';

// const dir = path.join(process.cwd(), 'content', 'articles');

// /** Normalise un nom de fichier → slug URL-safe */
// function toSlug(filename) {
//   return filename
//     .replace(/\.md$/, '')           // retire l'extension
//     .trim()                         // espaces en début/fin
//     .replace(/\s+/g, '-')           // espaces → tiret
//     .replace(/[–—‑]/g, '-')         // tous tirets Unicode → tiret clavier
//     .toLowerCase();
// }

// export function formatDate(d) {
//   return new Date(d).toLocaleDateString('fr-FR', {
//     day: 'numeric', month: 'long', year: 'numeric',
//   });
// }

// export function getAllArticles() {
//   return fs
//     .readdirSync(dir)
//     .filter((f) => f.endsWith('.md'))
//     .map((f) => {
//       const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
//       return { slug: toSlug(f), ...data };
//     })
//     .sort((a, b) => (a.date < b.date ? 1 : -1));
// }

// export async function getArticle(slug) {
//   // On cherche le fichier dont le slug normalisé correspond
//   const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
//   const match = files.find((f) => toSlug(f) === slug);
//   if (!match) return null;

//   const file = path.join(dir, match);
//   const { data, content } = matter(fs.readFileSync(file, 'utf8'));
//   const out = await remark().use(html).process(content);
//   return { slug, ...data, html: out.toString() };
// }

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const dir = path.join(process.cwd(), 'content', 'articles');

/** Nom de fichier → slug URL-safe */
function toSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // retire les accents
    .replace(/[–—‑]/g, '-')            // tirets Unicode → tiret clavier
    .replace(/\s+/g, '-')              // espaces → tiret
    .toLowerCase();
}

/** Force un chemin absolu pour les images (sauf URL http(s) ou chemin déjà absolu) */
function normalizeCover(cover) {
  if (!cover) return cover;
  return /^(https?:)?\//.test(cover) ? cover : `/${cover.replace(/^\.\//, '')}`;
}

/** Même règle pour les images écrites dans le corps Markdown */
function normalizeMarkdownImages(md) {
  return md.replace(
    /!\[([^\]]*)\]\((?!https?:|\/)(?:\.\/)?([^)]+)\)/g,
    '![$1](/$2)'
  );
}

/** Date YAML (objet Date) ou chaîne → timestamp, pour un tri fiable */
function toTime(d) {
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function formatDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getAllArticles() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return {
        slug: toSlug(f),
        ...data,
        cover: normalizeCover(data.cover),
        date: data.date ? new Date(data.date).toISOString() : null,
      };
    })
    .sort((a, b) => toTime(b.date) - toTime(a.date));
}

export async function getArticle(slug) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const match = files.find((f) => toSlug(f) === slug);
  if (!match) return null;

  const raw = fs.readFileSync(path.join(dir, match), 'utf8');
  const { data, content } = matter(raw);

  const out = await remark()
    .use(html)
    .process(normalizeMarkdownImages(content));

  return {
    slug,
    ...data,
    cover: normalizeCover(data.cover),
    date: data.date ? new Date(data.date).toISOString() : null,
    html: out.toString(),
  };
}