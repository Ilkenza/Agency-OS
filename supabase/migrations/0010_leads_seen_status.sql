-- Agency OS — leads: add "seen" status (they saw the message but haven't replied).
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'seen', 'replied', 'negotiating', 'won', 'lost'));
