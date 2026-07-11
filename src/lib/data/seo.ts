import { createClient } from "@/lib/supabase/server";
import type { SeoCheckWithProject } from "@/lib/types";

const WITH_PROJECT = "*, project:projects(title)";

export async function getChecks(): Promise<SeoCheckWithProject[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seo_checks")
    .select(WITH_PROJECT)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as SeoCheckWithProject[];
}

export async function getCheck(id: string): Promise<SeoCheckWithProject | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("seo_checks").select(WITH_PROJECT).eq("id", id).maybeSingle();
  return (data as unknown as SeoCheckWithProject | null) ?? null;
}

export async function getCheckCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("seo_checks").select("*", { count: "exact", head: true });
  return count ?? 0;
}
