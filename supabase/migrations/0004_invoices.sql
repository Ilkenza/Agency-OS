-- Agency OS — Phase 5: invoices
-- Multi-tenant: RLS scopes every row to its owner (auth.uid() = user_id).
-- A "sent" invoice past its due_date is treated as overdue in the app layer
-- (effectiveInvoiceStatus), so status here is the user-set value.

create table if not exists public.invoices (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id  uuid references public.clients (id) on delete set null,
  number     text,
  amount     numeric(12, 2) not null default 0,
  status     text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  issued_at  date,
  due_date   date,
  created_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "Invoices selectable by owner"
  on public.invoices for select using (auth.uid() = user_id);
create policy "Invoices insertable by owner"
  on public.invoices for insert with check (auth.uid() = user_id);
create policy "Invoices updatable by owner"
  on public.invoices for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Invoices deletable by owner"
  on public.invoices for delete using (auth.uid() = user_id);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_client_id_idx on public.invoices (client_id);
