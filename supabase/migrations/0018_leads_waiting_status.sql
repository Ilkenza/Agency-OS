-- Add a "waiting" lead status: they replied that their site is under construction
-- and will send it when done — follow up later.
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'seen', 'replied', 'negotiating', 'waiting', 'won', 'lost'));
