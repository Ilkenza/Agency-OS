-- Fix: the extension was inserting a new lead every time. Now ext_add_lead
-- updates the matching lead (same contact, else same name) instead of duplicating.
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
  existing_id uuid;
begin
  select id into uid from profiles where ext_token = p_token and coalesce(p_token, '') <> '';
  if uid is null then
    raise exception 'invalid token';
  end if;
  if coalesce(p_name, '') = '' then
    raise exception 'name required';
  end if;

  select l.id into existing_id
  from leads l
  where l.user_id = uid
    and (
      (coalesce(p_contact, '') <> '' and l.contact ilike p_contact)
      or (coalesce(p_name, '') <> '' and lower(l.name) = lower(p_name))
    )
  order by l.created_at desc
  limit 1;

  if existing_id is not null then
    update leads set
      name = p_name,
      company = nullif(p_company, ''),
      contact = nullif(p_contact, ''),
      channel = nullif(p_channel, ''),
      service = nullif(p_service, ''),
      status = coalesce(nullif(p_status, ''), 'new'),
      notes = nullif(p_notes, '')
    where id = existing_id;
    return existing_id;
  end if;

  insert into leads (user_id, name, company, contact, channel, service, status, notes)
  values (
    uid, p_name, nullif(p_company, ''), nullif(p_contact, ''), nullif(p_channel, ''),
    nullif(p_service, ''), coalesce(nullif(p_status, ''), 'new'), nullif(p_notes, '')
  )
  returning id into existing_id;
  return existing_id;
end;
$$;
