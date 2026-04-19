import { supabase } from '@/integrations/supabase/client';
import type { Property, PropertyTag } from './sampleProperties';

// Raw row shapes from Supabase
interface RawImage {
  url: string;
  is_main: boolean | null;
  sort_order: number | null;
}

interface RawProperty {
  id: string;
  ref: string;
  title_pt: string;
  title_en: string | null;
  description_pt: string | null;
  description_en: string | null;
  editorial_pt: string | null;
  editorial_en: string | null;
  transaction_type: 'sale' | 'rent';
  property_type: 'apartment' | 'house' | 'land' | 'commercial';
  island: string;
  city_or_zone: string;
  short_location: string | null;
  price: number;
  area: number | null;
  bedrooms: number;
  bathrooms: number;
  parking: string | null;
  status: string;
  is_featured: boolean;
  is_idonea_selection: boolean;
  is_investment: boolean;
  is_own_use: boolean;
  is_second_home: boolean;
  ideal_for_pt: string[] | null;
  ideal_for_en: string[] | null;
  property_images?: RawImage[] | null;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80';

/**
 * Sort images: main first, then by sort_order ascending.
 */
const sortImages = (imgs: RawImage[] | null | undefined): string[] => {
  if (!imgs || imgs.length === 0) return [];
  return [...imgs]
    .sort((a, b) => {
      if (a.is_main && !b.is_main) return -1;
      if (!a.is_main && b.is_main) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map(i => i.url);
};

/**
 * Build editorial tag list from boolean flags + transaction type.
 */
const buildTags = (row: RawProperty): PropertyTag[] => {
  const tags: PropertyTag[] = [];
  if (row.is_idonea_selection) tags.push('selection');
  if (row.is_investment) tags.push('investment');
  if (row.is_own_use) tags.push('personal');
  if (row.is_second_home) tags.push('second-home');
  if (row.transaction_type === 'rent') tags.push('rental');
  return tags;
};

/**
 * Map a Supabase property row (with joined images) into the
 * Property shape used by the public site components.
 *
 * EN fields fall back to PT (admin is currently PT-only).
 */
export const mapRowToProperty = (row: RawProperty): Property => {
  const images = sortImages(row.property_images);
  const mainImage = images[0] ?? FALLBACK_IMAGE;
  const tags = buildTags(row);
  const idealForPt = row.ideal_for_pt ?? [];
  const idealForEn = row.ideal_for_en && row.ideal_for_en.length > 0
    ? row.ideal_for_en
    : idealForPt;

  return {
    id: row.id,
    ref: row.ref,
    title_pt: row.title_pt,
    title_en: row.title_en || row.title_pt,
    description_pt: row.description_pt ?? '',
    description_en: row.description_en || row.description_pt || '',
    editorial_pt: row.editorial_pt ?? '',
    editorial_en: row.editorial_en || row.editorial_pt || '',
    type: row.transaction_type,
    property_type: row.property_type,
    price: Number(row.price),
    island: row.island,
    location: row.short_location || row.city_or_zone,
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    area: Number(row.area ?? 0),
    image: mainImage,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    featured: row.is_featured,
    tags,
    idealFor_pt: idealForPt,
    idealFor_en: idealForEn,
    features: row.parking
      ? [{ key: 'parking', value_pt: row.parking, value_en: row.parking }]
      : [],
    highlights: [],
  };
};

const SELECT_WITH_IMAGES = `
  id, ref, title_pt, title_en, description_pt, description_en,
  editorial_pt, editorial_en, transaction_type, property_type,
  island, city_or_zone, short_location, price, area,
  bedrooms, bathrooms, parking, status,
  is_featured, is_idonea_selection, is_investment, is_own_use, is_second_home,
  ideal_for_pt, ideal_for_en,
  property_images ( url, is_main, sort_order )
`;

/** Fetch all active properties (public listing). */
export const fetchActiveProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('status', 'active')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as unknown as RawProperty[]).map(mapRowToProperty);
};

/** Fetch active + featured properties (homepage). */
export const fetchFeaturedProperties = async (limit = 3): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as unknown as RawProperty[]).map(mapRowToProperty);
};

/** Fetch a single active property by id. */
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRowToProperty(data as unknown as RawProperty);
};

/** Fetch similar active properties (same island OR same transaction type). */
export const fetchSimilarProperties = async (
  excludeId: string,
  island: string,
  transactionType: 'sale' | 'rent',
  limit = 3
): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT_WITH_IMAGES)
    .eq('status', 'active')
    .neq('id', excludeId)
    .or(`island.eq.${island},transaction_type.eq.${transactionType}`)
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as unknown as RawProperty[]).map(mapRowToProperty);
};
