-- Allow google_maps + facebook channels (the extension writes these).
-- The old check omitted google_maps, which would have rejected Maps leads.
alter table public.leads drop constraint if exists leads_channel_check;
alter table public.leads add constraint leads_channel_check
  check (channel in ('email', 'instagram', 'google_maps', 'facebook', 'linkedin', 'whatsapp', 'phone', 'other'));
