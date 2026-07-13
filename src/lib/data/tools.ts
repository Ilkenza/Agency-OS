import { createClient } from "@/lib/supabase/server";
import type { Tool } from "@/lib/types";

export async function getTools(): Promise<Tool[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("*")
    .order("category", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getTool(id: string): Promise<Tool | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("tools").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getToolCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("tools").select("*", { count: "exact", head: true });
  return count ?? 0;
}
