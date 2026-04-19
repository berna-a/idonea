-- =====================================================
-- IDÓNEA — Adicionar campos de localização operacional
-- Correr no Supabase SQL Editor (projeto externo)
-- =====================================================
--
-- Adiciona ao properties:
--   • neighborhood   — bairro/zona (pode ser usado publicamente)
--   • address_full   — morada completa (PRIVADO, apenas admin)
--   • map_url        — link para Google Maps / Apple Maps (PRIVADO)
--   • latitude       — coordenada (PRIVADO, opcional)
--   • longitude      — coordenada (PRIVADO, opcional)
--
-- Os campos privados NÃO devem ser selecionados pelo frontend público.
-- O adapter público (src/lib/propertyAdapter.ts) já só pede colunas
-- explícitas, por isso a privacidade é garantida ao nível da query.
--
-- Para reforçar ao nível da base de dados (recomendado), revogamos
-- privilégios de SELECT ao role anon nas colunas privadas.
-- =====================================================

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS address_full TEXT,
  ADD COLUMN IF NOT EXISTS map_url TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Reforço de privacidade ao nível da BD: revogar SELECT das colunas
-- privadas para o role anon (público não autenticado).
-- Admins autenticados continuam a ver tudo via RLS + has_role.
REVOKE SELECT (address_full, map_url, latitude, longitude)
  ON public.properties FROM anon;

-- Garantir que authenticated mantém SELECT total (admins).
GRANT SELECT (address_full, map_url, latitude, longitude)
  ON public.properties TO authenticated;
