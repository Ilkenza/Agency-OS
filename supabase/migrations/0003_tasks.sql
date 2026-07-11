-- Agency OS — Phase 4: tasks
-- Multi-tenant: RLS scopes every row to its owner (auth.uid() = user_id).
-- project_id is optional; a task survives its project being deleted (SET NULL).

create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title      text not null,
  status     text not null default 'todo' check (status in ('todo', 'done')),
  priority   text not null default 'med' check (priority in ('low', 'med', 'high')),
  due_at     date,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Tasks selectable by owner"
  on public.tasks for select using (auth.uid() = user_id);
create policy "Tasks insertable by owner"
  on public.tasks for insert with check (auth.uid() = user_id);
create policy "Tasks updatable by owner"
  on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Tasks deletable by owner"
  on public.tasks for delete using (auth.uid() = user_id);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists tasks_user_due_idx on public.tasks (user_id, due_at);
