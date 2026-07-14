-- Round 2: richer client model, project currency, invoice line items, task time.

alter table public.clients
  add column if not exists region text check (region in ('domestic', 'foreign')),
  add column if not exists tier text check (tier in ('osnovni', 'standard', 'premium')),
  add column if not exists business_type text;

alter table public.projects
  add column if not exists currency text not null default 'EUR'
    check (currency in ('EUR', 'USD', 'RSD'));

alter table public.invoices
  add column if not exists items jsonb not null default '[]'::jsonb;

-- Tasks: allow an optional time-of-day on the due date.
alter table public.tasks
  alter column due_at type timestamptz using due_at::timestamptz;
