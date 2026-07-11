-- Agency OS — Phase 6: monthly revenue goal on the user's profile.
-- Existing profiles RLS (update where auth.uid() = id) already covers writes.

alter table public.profiles
  add column if not exists revenue_goal numeric(12, 2) not null default 0;
