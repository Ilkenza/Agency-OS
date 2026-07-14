"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type ClientFormState = { error?: string } | undefined;

export async function saveClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const businessType = String(formData.get("business_type") ?? "").trim() || null;
  const regionRaw = String(formData.get("region") ?? "").trim();
  const region = ["domestic", "foreign"].includes(regionRaw) ? regionRaw : null;
  const tierRaw = String(formData.get("tier") ?? "").trim();
  const tier = ["osnovni", "standard", "premium"].includes(tierRaw) ? tierRaw : null;

  if (!name) return { error: "Name is required." };

  const supabase = await createSupabaseServerClient();
  const payload = { name, contact, notes, business_type: businessType, region, tier };

  if (id) {
    const { error } = await supabase.from("clients").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("clients").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/clients");
  revalidatePath("/");
  redirect("/clients");
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/clients");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/clients");
}
