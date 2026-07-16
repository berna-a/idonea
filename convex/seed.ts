import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

/** Wipes all properties — used to re-seed cleanly during development. */
export const clearProperties = internalMutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query('properties').collect();
    for (const doc of docs) await ctx.db.delete(doc._id);
    return docs.length;
  },
});

/** Wipes all leads — used to clear test submissions during development. */
export const clearLeads = internalMutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query('leads').collect();
    for (const doc of docs) await ctx.db.delete(doc._id);
    return docs.length;
  },
});

/** Sets a single property's images by ref — used to attach freshly uploaded storage IDs during development. */
export const setPropertyImage = internalMutation({
  args: { ref: v.string(), storageId: v.id('_storage') },
  handler: async (ctx, { ref, storageId }) => {
    const doc = await ctx.db
      .query('properties')
      .filter((q) => q.eq(q.field('ref'), ref))
      .unique();
    if (!doc) throw new Error(`No property with ref ${ref}`);
    await ctx.db.patch(doc._id, { images: [{ storageId, sortOrder: 0 }] });
  },
});

/** Appends an image to a property's gallery by ref — used to build out multi-photo galleries during development. */
export const appendPropertyImage = internalMutation({
  args: { ref: v.string(), storageId: v.id('_storage') },
  handler: async (ctx, { ref, storageId }) => {
    const doc = await ctx.db
      .query('properties')
      .filter((q) => q.eq(q.field('ref'), ref))
      .unique();
    if (!doc) throw new Error(`No property with ref ${ref}`);
    const nextSortOrder = doc.images.length;
    await ctx.db.patch(doc._id, { images: [...doc.images, { storageId, sortOrder: nextSortOrder }] });
  },
});

/**
 * One-off seed for demoing the public site against Convex.
 * Run via: npx convex run seed:seedLuxuryProperties '{"imageStorageId":"<id>"}'
 */
export const seedLuxuryProperties = internalMutation({
  args: { imageStorageId: v.optional(v.id('_storage')) },
  handler: async (ctx, { imageStorageId }) => {
    const images = imageStorageId ? [{ storageId: imageStorageId, sortOrder: 0 }] : [];

    const properties = [
      {
        ref: 'IDN-101',
        title_pt: 'Villa de Autor em Santa Maria',
        title_en: 'Architect Villa in Santa Maria',
        description_pt: 'Villa contemporânea de 4 suítes com piscina infinita e vista mar, a poucos passos da praia.',
        description_en: 'Contemporary 4-suite villa with infinity pool and sea view, steps from the beach.',
        editorial_pt: 'Uma peça de arquitectura assinada, desenhada para dissolver a fronteira entre interior e Atlântico. Piscina infinita, pé-direito duplo na sala e uma suíte principal com vestir e vista panorâmica — a referência do segmento premium em Santa Maria.',
        editorial_en: 'A signature piece of architecture designed to dissolve the line between interior and Atlantic. Infinity pool, double-height living room and a principal suite with dressing room and panoramic views — the benchmark of the premium segment in Santa Maria.',
        transaction_type: 'sale' as const,
        property_type: 'house' as const,
        island: 'Sal',
        city_or_zone: 'Santa Maria',
        short_location: 'Santa Maria',
        coordinates: { lat: 16.5912, lng: -22.9046 },
        price: 95000000,
        currency: 'CVE' as const,
        area: 420,
        bedrooms: 4,
        bathrooms: 5,
        parking: 'Garagem 2 carros',
        status: 'active' as const,
        is_featured: true,
        is_idonea_selection: true,
        is_investment: false,
        is_own_use: true,
        is_second_home: true,
        ideal_for_pt: ['Segunda residência', 'Uso próprio', 'Comprador na diáspora'],
        ideal_for_en: ['Second home', 'Personal use', 'Diaspora buyer'],
        images,
      },
      {
        ref: 'IDN-102',
        title_pt: 'Penthouse com Vista Panorâmica — Praia',
        title_en: 'Panoramic Penthouse — Praia',
        description_pt: 'Cobertura de 3 suítes no último piso, terraço privativo de 80m² com vista sobre a baía da Praia.',
        description_en: 'Top-floor 3-suite penthouse with an 80m² private terrace overlooking Praia bay.',
        editorial_pt: 'No último piso de um dos edifícios mais bem posicionados da capital, este penthouse combina acabamentos de luxo com um terraço privativo pensado para viver ao ar livre — a assinatura de quem procura estatuto sem abdicar de discrição.',
        editorial_en: 'On the top floor of one of the capital\'s best-positioned buildings, this penthouse pairs luxury finishes with a private terrace built for outdoor living — the signature of buyers who want status without sacrificing discretion.',
        transaction_type: 'sale' as const,
        property_type: 'apartment' as const,
        island: 'Santiago',
        city_or_zone: 'Praia',
        short_location: 'Plateau, Praia',
        coordinates: { lat: 14.9177, lng: -23.5092 },
        price: 68000000,
        currency: 'CVE' as const,
        area: 280,
        bedrooms: 3,
        bathrooms: 4,
        parking: 'Garagem 2 carros',
        status: 'active' as const,
        is_featured: true,
        is_idonea_selection: true,
        is_investment: true,
        is_own_use: false,
        is_second_home: false,
        ideal_for_pt: ['Investimento premium', 'Investidor internacional'],
        ideal_for_en: ['Premium investment', 'International investor'],
        images,
      },
      {
        ref: 'IDN-103',
        title_pt: 'Moradia Boutique em Mindelo',
        title_en: 'Boutique House in Mindelo',
        description_pt: 'Moradia de 3 quartos totalmente remodelada, a dois minutos da marina, com pátio interior e acabamentos de autor.',
        description_en: 'Fully renovated 3-bedroom house, two minutes from the marina, with an interior courtyard and bespoke finishes.',
        editorial_pt: 'No coração cultural de Mindelo, esta moradia foi remodelada do zero preservando o carácter da fachada colonial e reinventando o interior com um pátio central que traz luz a todas as divisões — um raro equilíbrio entre herança e contemporaneidade.',
        editorial_en: 'In the cultural heart of Mindelo, this house was rebuilt from the ground up, preserving the colonial façade while reinventing the interior around a central courtyard that brings light into every room — a rare balance of heritage and contemporary design.',
        transaction_type: 'sale' as const,
        property_type: 'house' as const,
        island: 'São Vicente',
        city_or_zone: 'Mindelo',
        short_location: 'Centro Histórico, Mindelo',
        coordinates: { lat: 16.8901, lng: -24.9884 },
        price: 42000000,
        currency: 'CVE' as const,
        area: 210,
        bedrooms: 3,
        bathrooms: 3,
        parking: 'Garagem 1 carro',
        status: 'active' as const,
        is_featured: true,
        is_idonea_selection: true,
        is_investment: false,
        is_own_use: true,
        is_second_home: true,
        ideal_for_pt: ['Segunda residência', 'Comprador na diáspora'],
        ideal_for_en: ['Second home', 'Diaspora buyer'],
        images,
      },
      {
        ref: 'IDN-104',
        title_pt: 'Apartamento de Autor para Arrendamento — Sal',
        title_en: 'Designer Apartment for Rent — Sal',
        description_pt: 'T2 mobilado com design de autor, piscina comum e a 5 minutos a pé da praia de Santa Maria.',
        description_en: 'Designer-furnished 2-bedroom apartment, shared pool, a 5-minute walk from Santa Maria beach.',
        editorial_pt: 'Mobilado ao detalhe por um estúdio de interiores local, este T2 alia conforto imediato a uma localização que dispensa carro — ideal para estadias médias ou longas de quem quer viver o Sal como residente, não como turista.',
        editorial_en: 'Furnished down to the last detail by a local interior design studio, this two-bedroom apartment pairs immediate comfort with a location that needs no car — ideal for medium to long stays for those who want to live Sal like a resident, not a tourist.',
        transaction_type: 'rent' as const,
        property_type: 'apartment' as const,
        island: 'Sal',
        city_or_zone: 'Santa Maria',
        short_location: 'Santa Maria',
        coordinates: { lat: 16.5945, lng: -22.918 },
        price: 180000,
        currency: 'CVE' as const,
        area: 95,
        bedrooms: 2,
        bathrooms: 2,
        parking: undefined,
        status: 'active' as const,
        is_featured: true,
        is_idonea_selection: false,
        is_investment: false,
        is_own_use: false,
        is_second_home: false,
        ideal_for_pt: ['Estadias médias', 'Profissionais remotos'],
        ideal_for_en: ['Medium-term stays', 'Remote professionals'],
        images,
      },
    ];

    const ids = [];
    for (const property of properties) {
      ids.push(await ctx.db.insert('properties', property));
    }
    return ids;
  },
});
