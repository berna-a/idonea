import { convex, api, SITE_ORIGIN, esc } from './_lib/seo.js';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/properties', priority: '0.9', changefreq: 'daily' },
  { path: '/investment', priority: '0.8', changefreq: 'monthly' },
  { path: '/diaspora', priority: '0.8', changefreq: 'monthly' },
  { path: '/sell', priority: '0.7', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/ilhas/sal', priority: '0.85', changefreq: 'weekly' },
  { path: '/ilhas/santiago', priority: '0.85', changefreq: 'weekly' },
  { path: '/ilhas/sao-vicente', priority: '0.85', changefreq: 'weekly' },
  { path: '/ilhas/boa-vista', priority: '0.85', changefreq: 'weekly' },
  { path: '/guias/comprar-do-estrangeiro', priority: '0.75', changefreq: 'monthly' },
  { path: '/guias/custos-e-impostos', priority: '0.75', changefreq: 'monthly' },
  { path: '/guias/roi-arrendamento-turistico', priority: '0.75', changefreq: 'monthly' },
];

/** Dynamic sitemap.xml — static pages + one entry per active property. */
export default async function handler(req, res) {
  let properties = [];
  try {
    properties = await convex().query(api.properties.listForSeo, {});
  } catch {
    // Still emit the static routes if Convex is unreachable.
    properties = [];
  }

  const urls = [
    ...STATIC_ROUTES.map(
      (r) =>
        `<url><loc>${SITE_ORIGIN}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    ),
    ...properties.map((p) => {
      const lastmod = new Date(p.updatedAt).toISOString().slice(0, 10);
      const loc = `${SITE_ORIGIN}/properties/${p.id}`;
      const img = p.image
        ? `<image:image><image:loc>${esc(p.image)}</image:loc><image:title>${esc(p.title)}</image:title></image:image>`
        : '';
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${img}</url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(xml);
}
