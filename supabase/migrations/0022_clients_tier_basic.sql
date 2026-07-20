-- Align client tier values with the app (osnovni → basic).
update public.clients set tier = 'basic' where tier = 'osnovni';
alter table public.clients drop constraint if exists clients_tier_check;
alter table public.clients add constraint clients_tier_check
  check (tier in ('basic', 'standard', 'premium'));
