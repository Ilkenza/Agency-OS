-- Agency OS — leads: what you pitched (new_site / redesign / fix). Free text, optional.
alter table public.leads add column if not exists service text;
