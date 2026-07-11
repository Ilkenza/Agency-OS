-- Agency OS — Phase 8 (bonus): leads / outreach tracker + message templates.
-- Multi-tenant via RLS (auth.uid() = user_id). A lead can convert to a client (client_id).

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name           text not null,
  company        text,
  contact        text,
  channel        text check (channel in ('email', 'instagram', 'linkedin', 'whatsapp', 'phone', 'other')),
  status         text not null default 'new'
                 check (status in ('new', 'contacted', 'replied', 'negotiating', 'won', 'lost')),
  value          numeric(12, 2) not null default 0,
  notes          text,
  last_contact_at date,
  next_followup  date,
  client_id      uuid references public.clients (id) on delete set null,
  created_at     timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Leads selectable by owner"
  on public.leads for select using (auth.uid() = user_id);
create policy "Leads insertable by owner"
  on public.leads for insert with check (auth.uid() = user_id);
create policy "Leads updatable by owner"
  on public.leads for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Leads deletable by owner"
  on public.leads for delete using (auth.uid() = user_id);

create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_user_followup_idx on public.leads (user_id, next_followup);

create table if not exists public.outreach_templates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title      text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

alter table public.outreach_templates enable row level security;

create policy "Templates selectable by owner"
  on public.outreach_templates for select using (auth.uid() = user_id);
create policy "Templates insertable by owner"
  on public.outreach_templates for insert with check (auth.uid() = user_id);
create policy "Templates updatable by owner"
  on public.outreach_templates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Templates deletable by owner"
  on public.outreach_templates for delete using (auth.uid() = user_id);

create index if not exists outreach_templates_user_id_idx on public.outreach_templates (user_id);
