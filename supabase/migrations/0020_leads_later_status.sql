-- Add "later" lead status: not interested now, but said they'd keep me in mind
-- if they ever build a site — revisit later.
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'seen', 'replied', 'negotiating', 'waiting', 'later', 'won', 'lost'));
