import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api.js';

// Public (publishable) Convex deployment URL — safe to expose. Env override for other envs.
const CONVEX_URL =
  process.env.VITE_CONVEX_URL ||
  process.env.CONVEX_URL ||
  'https://useful-meadowlark-135.eu-west-1.convex.cloud';

export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://idonea-023.vercel.app';

export const convex = () => new ConvexHttpClient(CONVEX_URL);
export { api };

/** Escape a string for safe insertion into an HTML attribute or text node. */
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Cape Verde escudo formatter (server-side, no Intl locale dependency risk). */
export const formatCve = (price) =>
  `${Number(price).toLocaleString('pt-CV')} CVE`;

/** Fetch the built index.html for the current deployment so we can rewrite its <head>. */
export const fetchBaseHtml = async (host) => {
  const res = await fetch(`https://${host}/index.html`);
  if (!res.ok) throw new Error(`base html ${res.status}`);
  return res.text();
};

/**
 * Replace the marketing <head> meta of the base HTML with per-page values,
 * and inject an optional JSON-LD block before </head>.
 */
export const injectMeta = (html, { title, description, url, image, jsonLd }) => {
  const T = esc(title);
  const D = esc(description);
  const U = esc(url);
  const I = esc(image);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${D}" />`
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${T}" />`
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${D}" />`
    )
    .replace(
      /<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${I}" />`
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${T}" />`
    )
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${D}" />`
    )
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${I}" />`
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${U}" />`
    )
    .replace(
      /<meta property="og:type"[^>]*>/,
      `<meta property="og:type" content="article" />`
    );

  if (jsonLd) {
    const block = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head>`;
    out = out.replace('</head>', block);
  }
  return out;
};
