-- Agency OS — Phase 3: clients + projects
-- Both are multi-tenant: RLS scopes every row to its owner (auth.uid() = user_id).
-- user_id defaults to auth.uid() so inserts don't need to pass it.

-- clients
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  contact    text,
  notes      text,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Clients selectable by owner"
  on public.clients for select using (auth.uid() = user_id);
create policy "Clients insertable by owner"
  on public.clients for insert with check (auth.uid() = user_id);
create policy "Clients updatable by owner"
  on public.clients for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Clients deletable by owner"
  on public.clients for delete using (auth.uid() = user_id);

create index if not exists clients_user_id_idx on public.clients (user_id);

-- projects
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id   uuid references public.clients (id) on delete set null,
  title       text not null,
  description text,
  status      text not null default 'draft'
              check (status in ('draft', 'pending', 'in_progress', 'delivered')),
  value       numeric(12, 2) not null default 0,
  due_date    date,
  created_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Projects selectable by owner"
  on public.projects for select using (auth.uid() = user_id);
create policy "Projects insertable by owner"
  on public.projects for insert with check (auth.uid() = user_id);
create policy "Projects updatable by owner"
  on public.projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Projects deletable by owner"
  on public.projects for delete using (auth.uid() = user_id);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_client_id_idx on public.projects (client_id);
