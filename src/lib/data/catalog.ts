import { createClient } from "@/lib/supabase/server";
import type { ServiceItem } from "@/lib/types";

export async function getServiceItems(): Promise<ServiceItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_items")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getServiceItem(id: string): Promise<ServiceItem | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("service_items").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
