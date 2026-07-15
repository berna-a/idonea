import {
  convex,
  api,
  SITE_ORIGIN,
  fetchBaseHtml,
  injectMeta,
  formatCve,
} from './_lib/seo.js';

/**
 * Server-renders the <head> of a property detail page so crawlers
 * (Google) and social unfurlers (WhatsApp, Facebook) get per-property
 * title, description, OG image and RealEstateListing structured data.
 * Real users get the same HTML and the SPA hydrates on top of it.
 *
 * Reachable via the vercel.json rewrite: /properties/:id -> /api/property?id=:id
 * On any failure it falls back to the plain SPA shell (never breaks the page).
 */
export default async function handler(req, res) {
  const host = req.headers.host;
  const id = req.query.id;

  try {
    const base = await fetchBaseHtml(host);
    const prop = id ? await convex().query(api.properties.getByIdForSeo, { id }) : null;

    if (!prop) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(base);
    }

    const url = `${SITE_ORIGIN}/properties/${prop.id}`;
    const transaction = prop.type === 'sale' ? 'Venda' : 'Arrendamento';
    const title = `${prop.title} — ${prop.location}, ${prop.island} | IDÓNEA`;
    const priceLabel = prop.type === 'rent' ? `${formatCve(prop.price)}/mês` : formatCve(prop.price);
    const description =
      prop.description ||
      `${transaction} · ${prop.location}, ${prop.island} · ${priceLabel}. Imóvel selecionado pela IDÓNEA, mediação imobiliária em Cabo Verde.`;
    const image = prop.image || `${SITE_ORIGIN}/og-image.jpg`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: prop.title,
      description,
      url,
      image: (prop.images && prop.images.length ? prop.images : [image]).filter(Boolean),
      datePosted: new Date(prop.updatedAt).toISOString(),
      address: {
        '@type': 'PostalAddress',
        addressLocality: prop.location,
        addressRegion: prop.island,
        addressCountry: 'CV',
      },
      offers: {
        '@type': 'Offer',
        price: prop.price,
        priceCurrency: 'CVE',
        availability: 'https://schema.org/InStock',
      },
      ...(prop.bedrooms > 0 && { numberOfBedroomsTotal: prop.bedrooms }),
      ...(prop.area > 0 && {
        floorSize: { '@type': 'QuantitativeValue', value: prop.area, unitCode: 'MTK' },
      }),
    };

    const html = injectMeta(base, { title, description, url, image, jsonLd });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } catch (err) {
    // Never break the page over an SEO enhancement — fall back to the SPA shell.
    try {
      const base = await fetchBaseHtml(host);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(base);
    } catch {
      return res.status(500).send('Internal Error');
    }
  }
}
