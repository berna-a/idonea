-- =====================================================
-- IDÓNEA Mediação Imobiliária — Database Schema
-- Run this SQL in Supabase SQL Editor (supabase.com → project → SQL Editor)
-- =====================================================

-- 1. ENUMS
-- =====================================================

CREATE TYPE public.property_status AS ENUM ('draft', 'active', 'reserved', 'sold', 'archived');
CREATE TYPE public.transaction_type AS ENUM ('sale', 'rent');
CREATE TYPE public.property_type_enum AS ENUM ('apartment', 'house', 'land', 'commercial');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');


-- 2. PROPERTIES TABLE
-- =====================================================

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref TEXT NOT NULL UNIQUE,
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_pt TEXT,
  description_en TEXT,
  editorial_pt TEXT,
  editorial_en TEXT,
  transaction_type public.transaction_type NOT NULL,
  property_type public.property_type_enum NOT NULL,
  island TEXT NOT NULL,
  city_or_zone TEXT NOT NULL,
  short_location TEXT,
  price NUMERIC NOT NULL,
  area NUMERIC,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  parking TEXT,
  status public.property_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_idonea_selection BOOLEAN NOT NULL DEFAULT false,
  is_investment BOOLEAN NOT NULL DEFAULT false,
  is_own_use BOOLEAN NOT NULL DEFAULT false,
  is_second_home BOOLEAN NOT NULL DEFAULT false,
  ideal_for_pt TEXT[] DEFAULT '{}',
  ideal_for_en TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- 3. PROPERTY IMAGES TABLE
-- =====================================================

CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_pt TEXT,
  alt_en TEXT,
  is_main BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);


-- 4. PROPERTY FEATURES TABLE
-- =====================================================

CREATE TABLE public.property_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_pt TEXT NOT NULL,
  value_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_property_features_property_id ON public.property_features(property_id);


-- 5. PROPERTY HIGHLIGHTS TABLE
-- =====================================================

CREATE TABLE public.property_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_property_highlights_property_id ON public.property_highlights(property_id);


-- 6. USER ROLES TABLE
-- =====================================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);


-- 7. SECURITY DEFINER FUNCTION FOR ROLE CHECKS
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


-- 8. ROW LEVEL SECURITY
-- =====================================================

-- Properties: public read for active, admin full access
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can do everything with properties"
  ON public.properties FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Property Images: public read, admin write
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view property images"
  ON public.property_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage property images"
  ON public.property_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Property Features: public read, admin write
ALTER TABLE public.property_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view property features"
  ON public.property_features FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage property features"
  ON public.property_features FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Property Highlights: public read, admin write
ALTER TABLE public.property_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view property highlights"
  ON public.property_highlights FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage property highlights"
  ON public.property_highlights FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User Roles: only admins can view/manage
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 9. STORAGE BUCKET FOR PROPERTY IMAGES
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Public read access
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Admins can upload/delete
CREATE POLICY "Admins can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.has_role(auth.uid(), 'admin')
  );
