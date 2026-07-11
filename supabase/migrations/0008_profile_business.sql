-- Agency OS — Settings: business details on the profile (used on invoices)
-- and a self-service account-deletion RPC.

alter table public.profiles
  add column if not exists business_name text,
  add column if not exists business_email text,
  add column if not exists business_address text,
  add column if not exists vat_id text;

-- Clients can't delete their own auth.users row directly, so expose a
-- SECURITY DEFINER RPC that deletes only the caller. Deleting the auth user
-- cascades to the profile and every user-owned table (all user_id FKs cascade).
create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.delete_user() from anon, public;
grant execute on function public.delete_user() to authenticated;
