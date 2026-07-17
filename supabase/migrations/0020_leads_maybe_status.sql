-- Add a "maybe" lead status: not interested now, but will keep me in mind if
-- they ever build a site — worth a later follow-up.
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'seen', 'replied', 'negotiating', 'waiting', 'maybe', 'won', 'lost'));
