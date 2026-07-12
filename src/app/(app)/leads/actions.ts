"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/status";
import { parseLeadsImport } from "@/lib/leads/parse-import";

export type LeadFormState = { error?: string } | undefined;

export type ImportState =
  | { imported?: number; skipped?: number; error?: string }
  | undefined;

/** Bulk-create leads from pasted CSV/TSV (spreadsheet). RLS fills user_id. */
export async function importLeads(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const text = String(formData.get("data") ?? "");
  const { rows, skipped, error } = parseLeadsImport(text);
  if (error) return { error };
  if (rows.length === 0) return { error: "No valid rows found — check the header and data." };

  const supabase = await createSupabaseServerClient();
  const { error: dbError } = await supabase.from("leads").insert(rows);
  if (dbError) return { error: dbError.message };

  revalidatePath("/leads");
  revalidatePath("/");
  return { imported: rows.length, skipped };
}

export async function saveLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const contact = String(formData.get("contact") ?? "").trim() || null;
  const channel = String(formData.get("channel") ?? "").trim() || null;
  const service = String(formData.get("service") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "new");
  const valueRaw = String(formData.get("value") ?? "").trim();
  const lastContactAt = String(formData.get("last_contact_at") ?? "").trim() || null;
  const nextFollowup = String(formData.get("next_followup") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) return { error: "Name is required." };
  if (!LEAD_STATUSES.includes(status as LeadStatus)) return { error: "Invalid status." };

  const value = valueRaw ? Number(valueRaw) : 0;
  if (Number.isNaN(value) || value < 0) return { error: "Value must be a positive number." };

  const supabase = await createSupabaseServerClient();
  const payload = {
    name,
    company,
    contact,
    channel,
    service,
    status,
    value,
    last_contact_at: lastContactAt,
    next_followup: nextFollowup,
    notes,
  };

  if (id) {
    const { error } = await supabase.from("leads").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("leads").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/leads");
  revalidatePath("/");
  redirect("/leads");
}

export async function deleteLead(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("leads").delete().eq("id", id);
  revalidatePath("/leads");
  revalidatePath("/");
  redirect("/leads");
}

/** Create a client from a won lead (or jump to the existing one), then mark the lead Won. */
export async function convertLeadToClient(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) redirect("/leads");

  if (lead.client_id) {
    redirect(`/clients/${lead.client_id}`);
  }

  const { data: client, error } = await supabase
    .from("clients")
    .insert({ name: lead.company || lead.name, contact: lead.contact, notes: lead.notes })
    .select("id")
    .single();
  if (error || !client) redirect("/leads");

  await supabase.from("leads").update({ client_id: client.id, status: "won" }).eq("id", id);

  revalidatePath("/leads");
  revalidatePath("/clients");
  revalidatePath("/");
  redirect(`/clients/${client.id}`);
}
