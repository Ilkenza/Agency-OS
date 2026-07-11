"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type TemplateFormState = { error?: string } | undefined;

export async function saveTemplate(
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title) return { error: "Title is required." };
  if (!body) return { error: "Message body is required." };

  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase.from("outreach_templates").update({ title, body }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("outreach_templates").insert({ title, body });
    if (error) return { error: error.message };
  }

  revalidatePath("/leads/templates");
  redirect("/leads/templates");
}

export async function deleteTemplate(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("outreach_templates").delete().eq("id", id);
  revalidatePath("/leads/templates");
  redirect("/leads/templates");
}
