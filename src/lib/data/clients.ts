import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/lib/types";

/** Client rows with an embedded project count (`projects(count)`). */
export type ClientWithCount = Client & { projects: { count: number }[] };

export async function getClientsWithCounts(): Promise<ClientWithCount[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*, projects(count)")
    .order("created_at", { ascending: false });
  return (data ?? []) as ClientWithCount[];
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getClientCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("clients").select("*", { count: "exact", head: true });
  return count ?? 0;
}
