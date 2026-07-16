-- Add "interested" (warm yes, pre-negotiation) and "follow_up_soon"
-- (they'll be in touch soon — keep warm, follow up in days).
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in (
    'new', 'contacted', 'seen', 'replied', 'interested', 'follow_up_soon',
    'negotiating', 'waiting', 'maybe', 'won', 'lost'
  ));
