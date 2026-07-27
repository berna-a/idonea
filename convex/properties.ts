import { query, QueryCtx } from './_generated/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';

type PropertyTag = 'selection' | 'investment' | 'personal' | 'second-home' | 'rental';

const buildTags = (doc: Doc<'properties'>): PropertyTag[] => {
  const tags: PropertyTag[] = [];
  if (doc.is_idonea_selection) tags.push('selection');
  if (doc.is_investment) tags.push('investment');
  if (doc.is_own_use) tags.push('personal');
  if (doc.is_second_home) tags.push('second-home');
  if (doc.transaction_type === 'rent') tags.push('rental');
  return tags;
};

const resolveImages = async (ctx: QueryCtx, doc: Doc<'properties'>): Promise<string[]> => {
  const sorted = [...doc.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const urls = await Promise.all(sorted.map((img) => ctx.storage.getUrl(img.storageId)));
  return urls.filter((u): u is string => u !== null);
};

/** Maps a Convex property document into the public-site `Property` shape. */
const mapDoc = async (ctx: QueryCtx, doc: Doc<'properties'>) => {
  const images = await resolveImages(ctx, doc);
  const idealForPt = doc.ideal_for_pt ?? [];
  return {
    id: doc._id,
    ref: doc.ref,
    title_pt: doc.title_pt,
    title_en: doc.title_en || doc.title_pt,
    description_pt: doc.description_pt ?? '',
    description_en: doc.description_en || doc.description_pt || '',
    editorial_pt: doc.editorial_pt ?? '',
    editorial_en: doc.editorial_en || doc.editorial_pt || '',
    type: doc.transaction_type,
    property_type: doc.property_type,
    price: doc.price,
    island: doc.island,
    location: doc.short_location || doc.city_or_zone,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    area: doc.area ?? 0,
    coordinates: doc.coordinates ?? null,
    image: images[0] ?? '',
    images,
    featured: doc.is_featured,
    tags: buildTags(doc),
    idealFor_pt: idealForPt,
    idealFor_en: doc.ideal_for_en && doc.ideal_for_en.length > 0 ? doc.ideal_for_en : idealForPt,
    features: doc.parking ? [{ key: 'parking', value_pt: doc.parking, value_en: doc.parking }] : [],
    highlights: [] as never[],
  };
};

/** Active properties (public listing), most recent first. */
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .order('desc')
      .collect();
    return Promise.all(docs.map((d) => mapDoc(ctx, d)));
  },
});

/** Active + featured properties (homepage highlight). */
export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const docs = await ctx.db
      .query('properties')
      .withIndex('by_status_featured', (q) => q.eq('status', 'active').eq('is_featured', true))
      .order('desc')
      .take(limit ?? 3);
    return Promise.all(docs.map((d) => mapDoc(ctx, d)));
  },
});

/** Single active property by id. */
export const getById = query({
  args: { id: v.id('properties') },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc || doc.status !== 'active') return null;
    return mapDoc(ctx, doc);
  },
});

/** Similar active properties (same island or same transaction type). */
export const listSimilar = query({
  args: {
    excludeId: v.id('properties'),
    island: v.string(),
    transactionType: v.union(v.literal('sale'), v.literal('rent')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { excludeId, island, transactionType, limit }) => {
    const docs = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();
    const filtered = docs
      .filter((d) => d._id !== excludeId && (d.island === island || d.transaction_type === transactionType))
      .slice(0, limit ?? 3);
    return Promise.all(filtered.map((d) => mapDoc(ctx, d)));
  },
});

/**
 * Lightweight projection of active properties for server-side SEO
 * (sitemap generation + per-property meta rendering). Kept small on purpose.
 */
export const listForSeo = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .order('desc')
      .collect();
    return Promise.all(
      docs.map(async (doc) => {
        const images = await resolveImages(ctx, doc);
        return {
          id: doc._id,
          ref: doc.ref,
          title: doc.title_pt,
          location: doc.short_location || doc.city_or_zone,
          island: doc.island,
          type: doc.transaction_type,
          property_type: doc.property_type,
          price: doc.price,
          bedrooms: doc.bedrooms,
          bathrooms: doc.bathrooms,
          area: doc.area ?? 0,
          description: (doc.editorial_pt || doc.description_pt || '').slice(0, 200),
          image: images[0] ?? null,
          updatedAt: doc._creationTime,
        };
      })
    );
  },
});

/** Single active property, minimal projection for server-side meta rendering. */
export const getByIdForSeo = query({
  args: { id: v.id('properties') },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc || doc.status !== 'active') return null;
    const images = await resolveImages(ctx, doc);
    return {
      id: doc._id,
      ref: doc.ref,
      title: doc.title_pt,
      location: doc.short_location || doc.city_or_zone,
      island: doc.island,
      type: doc.transaction_type,
      property_type: doc.property_type,
      price: doc.price,
      bedrooms: doc.bedrooms,
      bathrooms: doc.bathrooms,
      area: doc.area ?? 0,
      description: (doc.editorial_pt || doc.description_pt || '').slice(0, 200),
      image: images[0] ?? null,
      images,
      updatedAt: doc._creationTime,
    };
  },
});
