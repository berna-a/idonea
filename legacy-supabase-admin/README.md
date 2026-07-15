# Admin legado (Supabase)

Este código foi movido para fora de `src/` a 2026-07-14, durante a migração do backend público (site + dados de imóveis) de Supabase para Convex.

**Porquê está aqui e não apagado:** o painel admin (login, dashboard, CRUD de imóveis, upload de fotos) depende inteiramente de Supabase Auth (sessão, RPC `has_role`) e do Storage do Supabase. Migrar isto para Convex implica escolher um novo sistema de autenticação (Convex Auth, Clerk, ou outro) — uma decisão de arquitectura à parte que ainda não foi tomada. Por isso ficou de fora do build (`tsconfig.app.json` só inclui `src/`) em vez de ser reescrito às cegas.

**Para retomar:** decidir o provider de autenticação, recriar o CRUD de imóveis sobre as mutations Convex em `convex/properties.ts` (falta `create`/`update`/`delete`, que ainda não existem — só há `generateUploadUrl` e as queries de leitura pública), e só depois voltar a ligar as rotas `/admin/*` em `src/App.tsx`.
