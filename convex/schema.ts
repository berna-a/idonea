import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  properties: defineTable({
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
    ideal_for_pt: v.optional(v.array(v.string())),
    ideal_for_en: v.optional(v.array(v.string())),
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        sortOrder: v.number(),
      })
    ),
  })
    .index('by_status', ['status'])
    .index('by_status_featured', ['status', 'is_featured'])
    .index('by_island', ['island']),

  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    interest: v.optional(v.string()),
    message: v.string(),
    property_ref: v.optional(v.string()),
    property_title: v.optional(v.string()),
    intent: v.optional(v.string()),
    source: v.string(),
    status: v.union(v.literal('new'), v.literal('contacted'), v.literal('archived')),
  }).index('by_status', ['status']),
});
