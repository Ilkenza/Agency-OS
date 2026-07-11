# Agency OS — Setup (Phase 1: Auth)

Phase 1 is **built and verified end-to-end**. The Supabase project is created, the schema is
applied, and `.env.local` is filled in. To run locally:

```
npm run dev
```

Open http://localhost:3000 → you're redirected to `/login`. Sign up, then sign in.

## What's already done

- **Supabase project** `agency-os` created (org `ilke'org`, region `eu-central-1`).
- **Schema applied** — `profiles` table + Row Level Security + `handle_new_user` trigger
  (auto-creates a profile row on sign-up). Source: [`supabase/migrations/0001_init_auth.sql`](supabase/migrations/0001_init_auth.sql).
- **Keys wired** into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` + publishable key).
- **Verified:** sign-up creates the auth user + profile row (full name flows through the
  trigger), sign-in reaches the protected home, sign-out returns to `/login`, and
  unauthenticated access to `/` redirects to `/login`. Build, lint and security advisors are clean.

## Optional: instant login while testing

By default Supabase requires email confirmation, so a fresh sign-up shows a
"check your email" message instead of logging you straight in. For faster local testing:

- Supabase dashboard → **Authentication → Sign In / Providers → Email** → turn **off**
  "Confirm email".

## Later (not now)

- **Google OAuth** — add Google credentials under Authentication → Providers, then enable the
  disabled "Continue with Google" button.
- **Phases 2–6** — workspace shell (sidebar/topbar/KPIs), Clients, Projects, Tasks, Invoices,
  revenue goal + activity feed. Each new table gets RLS `user_id = auth.uid()`.
