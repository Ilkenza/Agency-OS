-- Agency OS — Phase 7: SEO/GEO on-page checks.
-- One row per check run: url + score + results (jsonb array of findings).
-- Multi-tenant via RLS (auth.uid() = user_id).

create table if not exists public.seo_checks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  url        text not null,
  title      text,
  score      int not null default 0,
  results    jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.seo_checks enable row level security;

create policy "Seo checks selectable by owner"
  on public.seo_checks for select using (auth.uid() = user_id);
create policy "Seo checks insertable by owner"
  on public.seo_checks for insert with check (auth.uid() = user_id);
create policy "Seo checks updatable by owner"
  on public.seo_checks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Seo checks deletable by owner"
  on public.seo_checks for delete using (auth.uid() = user_id);

create index if not exists seo_checks_user_id_idx on public.seo_checks (user_id);
create index if not exists seo_checks_project_id_idx on public.seo_checks (project_id);
