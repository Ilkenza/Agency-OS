-- Separate "owner / contact person" (clients.contact) from the channel we reach them on.
alter table public.clients
  add column if not exists contact_channel text;
