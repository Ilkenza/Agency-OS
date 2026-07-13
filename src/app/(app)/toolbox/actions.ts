"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type ToolFormState = { error?: string } | undefined;

export async function saveTool(_prev: ToolFormState, formData: FormData): Promise<ToolFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  let url = String(formData.get("url") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) return { error: "Name is required." };
  if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;

  const supabase = await createSupabaseServerClient();
  const payload = { name, url, category, notes };

  if (id) {
    const { error } = await supabase.from("tools").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("tools").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/toolbox");
  redirect("/toolbox");
}

export async function deleteTool(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("tools").delete().eq("id", id);
  revalidatePath("/toolbox");
  redirect("/toolbox");
}

const STARTER = [
  { name: "Vercel", url: "https://vercel.com", category: "Hosting" },
  { name: "Supabase", url: "https://supabase.com", category: "Database" },
  { name: "Cloudflare", url: "https://cloudflare.com", category: "Hosting" },
  { name: "Brevo", url: "https://brevo.com", category: "Email" },
  { name: "Stripe", url: "https://stripe.com", category: "Payments" },
  { name: "Cal.com", url: "https://cal.com", category: "Booking" },
  { name: "remove.bg", url: "https://remove.bg", category: "Media" },
  { name: "TinyPNG", url: "https://tinypng.com", category: "Media" },
  { name: "Figma", url: "https://figma.com", category: "Design" },
  { name: "TempMail", url: "https://temp-mail.org", category: "Utility" },
  { name: "Google Analytics", url: "https://analytics.google.com", category: "Analytics" },
];

export async function addStarterTools() {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("tools")
    .insert(STARTER.map((t) => ({ name: t.name, url: t.url, category: t.category })));
  revalidatePath("/toolbox");
  redirect("/toolbox");
}
