-- Return the existing matching lead (or null) so the extension can pre-fill the
-- form and show it as already-saved when reopened.
create or replace function public.ext_get_lead(p_token text, p_contact text, p_name text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(x) from (
    select l.name, l.company, l.contact, l.channel, l.service, l.status, l.notes
    from leads l
    join profiles pr on pr.id = l.user_id
    where pr.ext_token = p_token
      and pr.ext_token is not null
      and (
        (coalesce(p_contact, '') <> '' and l.contact ilike p_contact)
        or (coalesce(p_name, '') <> '' and lower(l.name) = lower(p_name))
      )
    order by l.created_at desc
    limit 1
  ) x;
$$;

grant execute on function public.ext_get_lead(text, text, text) to anon, authenticated;
