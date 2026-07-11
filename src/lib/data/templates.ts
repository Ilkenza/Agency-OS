import { createClient } from "@/lib/supabase/server";
import type { OutreachTemplate } from "@/lib/types";

export async function getTemplates(): Promise<OutreachTemplate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("outreach_templates")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getTemplate(id: string): Promise<OutreachTemplate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("outreach_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}
