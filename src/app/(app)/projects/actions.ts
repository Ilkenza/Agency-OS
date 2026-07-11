"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/status";

export type ProjectFormState = { error?: string } | undefined;

export async function saveProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const clientId = String(formData.get("client_id") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft");
  const valueRaw = String(formData.get("value") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim() || null;

  if (!title) return { error: "Title is required." };
  if (!PROJECT_STATUSES.includes(status as ProjectStatus)) return { error: "Invalid status." };

  const value = valueRaw ? Number(valueRaw) : 0;
  if (Number.isNaN(value) || value < 0) return { error: "Value must be a positive number." };

  const supabase = await createSupabaseServerClient();
  const payload = {
    client_id: clientId,
    title,
    description,
    status,
    value,
    due_date: dueDate,
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects");
}
