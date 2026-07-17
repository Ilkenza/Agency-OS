import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/format";
import type { TaskWithProject } from "@/lib/types";

const WITH_PROJECT = "*, project:projects(title, client:clients(name))";

export async function getTasks(): Promise<TaskWithProject[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select(WITH_PROJECT)
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as TaskWithProject[];
}

export async function getTask(id: string): Promise<TaskWithProject | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select(WITH_PROJECT).eq("id", id).maybeSingle();
  return (data as TaskWithProject | null) ?? null;
}

/** Open tasks that are due today or overdue (for the Overview "Today" checklist). */
export async function getTasksForToday(): Promise<TaskWithProject[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select(WITH_PROJECT)
    .eq("status", "todo")
    .lte("due_at", `${todayISO()}T23:59:59`)
    .order("due_at", { ascending: true });
  return (data ?? []) as TaskWithProject[];
}

export async function getTodayOpenCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "todo")
    .lte("due_at", `${todayISO()}T23:59:59`);
  return count ?? 0;
}

/** All open tasks — powers the sidebar "Tasks" badge. */
export async function getOpenTaskCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "todo");
  return count ?? 0;
}
