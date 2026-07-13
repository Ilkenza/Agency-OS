-- Agency OS — Quotes (+ feature catalog), Toolbox, and invoice currency.
-- All tables multi-tenant via RLS (auth.uid() = user_id).

create table if not exists public.service_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label      text not null,
  price      numeric(12, 2) not null default 0,
  currency   text not null default 'EUR' check (currency in ('EUR', 'USD', 'RSD')),
  category   text,
  created_at timestamptz not null default now()
);
alter table public.service_items enable row level security;
create policy "Service items selectable by owner" on public.service_items for select using (auth.uid() = user_id);
create policy "Service items insertable by owner" on public.service_items for insert with check (auth.uid() = user_id);
create policy "Service items updatable by owner" on public.service_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Service items deletable by owner" on public.service_items for delete using (auth.uid() = user_id);
create index if not exists service_items_user_id_idx on public.service_items (user_id);

create table if not exists public.quotes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id  uuid references public.clients (id) on delete set null,
  title      text not null,
  currency   text not null default 'EUR' check (currency in ('EUR', 'USD', 'RSD')),
  status     text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  items      jsonb not null default '[]'::jsonb,
  invoice_id uuid references public.invoices (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.quotes enable row level security;
create policy "Quotes selectable by owner" on public.quotes for select using (auth.uid() = user_id);
create policy "Quotes insertable by owner" on public.quotes for insert with check (auth.uid() = user_id);
create policy "Quotes updatable by owner" on public.quotes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Quotes deletable by owner" on public.quotes for delete using (auth.uid() = user_id);
create index if not exists quotes_user_id_idx on public.quotes (user_id);
create index if not exists quotes_client_id_idx on public.quotes (client_id);

create table if not exists public.tools (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  url        text,
  category   text,
  notes      text,
  created_at timestamptz not null default now()
);
alter table public.tools enable row level security;
create policy "Tools selectable by owner" on public.tools for select using (auth.uid() = user_id);
create policy "Tools insertable by owner" on public.tools for insert with check (auth.uid() = user_id);
create policy "Tools updatable by owner" on public.tools for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Tools deletable by owner" on public.tools for delete using (auth.uid() = user_id);
create index if not exists tools_user_id_idx on public.tools (user_id);

alter table public.invoices add column if not exists currency text not null default 'EUR'
  check (currency in ('EUR', 'USD', 'RSD'));
