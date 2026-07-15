import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query, QueryCtx, MutationCtx } from './_generated/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';

const requireAuth = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error('Não autenticado.');
  return userId;
};

const propertyFields = {
  ref: v.string(),
  title_pt: v.string(),
  title_en: v.optional(v.string()),
  description_pt: v.optional(v.string()),
  description_en: v.optional(v.string()),
  editorial_pt: v.optional(v.string()),
  editorial_en: v.optional(v.string()),
  transaction_type: v.union(v.literal('sale'), v.literal('rent')),
  property_type: v.union(
    v.literal('apartment'),
    v.literal('house'),
    v.literal('land'),
    v.literal('commercial')
  ),
  island: v.string(),
  city_or_zone: v.string(),
  short_location: v.optional(v.string()),
  coordinates: v.optional(v.object({ lat: v.number(), lng: v.number() })),
  price: v.number(),
  currency: v.union(v.literal('CVE'), v.literal('EUR')),
  area: v.optional(v.number()),
  bedrooms: v.number(),
  bathrooms: v.number(),
  parking: v.optional(v.string()),
  status: v.union(v.literal('active'), v.literal('inactive'), v.literal('sold')),
  is_featured: v.boolean(),
  is_idonea_selection: v.boolean(),
  is_investment: v.boolean(),
  is_own_use: v.boolean(),
  is_second_home: v.boolean(),
  images: v.array(v.object({ storageId: v.id('_storage'), sortOrder: v.number() })),
};

const resolveAdminImages = async (ctx: QueryCtx, doc: Doc<'properties'>) => {
  const sorted = [...doc.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return Promise.all(
    sorted.map(async (img) => ({
      storageId: img.storageId,
      sortOrder: img.sortOrder,
      url: await ctx.storage.getUrl(img.storageId),
    }))
  );
};

/** All properties regardless of status, most recent first — admin dashboard only. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const docs = await ctx.db.query('properties').order('desc').collect();
    return Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        images: await resolveAdminImages(ctx, doc),
      }))
    );
  },
});

/** Single property, any status — admin edit form only. */
export const getByIdAdmin = query({
  args: { id: v.id('properties') },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    return { ...doc, images: await resolveAdminImages(ctx, doc) };
  },
});

export const createProperty = mutation({
  args: propertyFields,
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return ctx.db.insert('properties', args);
  },
});

export const updateProperty = mutation({
  args: { id: v.id('properties'), ...propertyFields },
  handler: async (ctx, { id, ...rest }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, rest);
  },
});

export const deleteProperty = mutation({
  args: { id: v.id('properties') },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc) return;
    await Promise.all(doc.images.map((img) => ctx.storage.delete(img.storageId)));
    await ctx.db.delete(id);
  },
});
