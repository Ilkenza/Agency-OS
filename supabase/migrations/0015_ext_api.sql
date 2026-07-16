-- Browser-extension API: per-user token + SECURITY DEFINER RPCs so the extension
-- can check/add leads via the public anon key without exposing the service role.

alter table public.profiles add column if not exists ext_token text unique;

create or replace function public.ext_lead_exists(p_token text, p_contact text, p_name text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1
    from leads l
    join profiles pr on pr.id = l.user_id
    where pr.ext_token = p_token
      and pr.ext_token is not null
      and (
        (coalesce(p_contact, '') <> '' and l.contact ilike p_contact)
        or (coalesce(p_name, '') <> '' and lower(l.name) = lower(p_name))
      )
  );
$$;

create or replace function public.ext_add_lead(
  p_token text,
  p_name text,
  p_company text,
  p_contact text,
  p_channel text,
  p_service text,
  p_status text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  new_id uuid;
begin
  select id into uid from profiles where ext_token = p_token and coalesce(p_token, '') <> '';
  if uid is null then
    raise exception 'invalid token';
  end if;
  if coalesce(p_name, '') = '' then
    raise exception 'name required';
  end if;
  insert into leads (user_id, name, company, contact, channel, service, status, notes)
  values (
    uid,
    p_name,
    nullif(p_company, ''),
    nullif(p_contact, ''),
    nullif(p_channel, ''),
    nullif(p_service, ''),
    coalesce(nullif(p_status, ''), 'new'),
    nullif(p_notes, '')
  )
  returning id into new_id;
  return new_id;
end;
$$;

grant execute on function public.ext_lead_exists(text, text, text) to anon, authenticated;
grant execute on function public.ext_add_lead(text, text, text, text, text, text, text, text) to anon, authenticated;
