"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type ServiceItemState = { error?: string } | undefined;

const CURRENCIES = ["EUR", "USD", "RSD"];

export async function saveServiceItem(
  _prev: ServiceItemState,
  formData: FormData,
): Promise<ServiceItemState> {
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const currencyRaw = String(formData.get("currency") ?? "EUR");
  const currency = CURRENCIES.includes(currencyRaw) ? currencyRaw : "EUR";
  const priceRaw = String(formData.get("price") ?? "").trim();

  if (!label) return { error: "Label is required." };
  const price = priceRaw ? Number(priceRaw) : 0;
  if (Number.isNaN(price) || price < 0) return { error: "Price must be a positive number." };

  const supabase = await createSupabaseServerClient();
  const payload = { label, price, currency, category };

  if (id) {
    const { error } = await supabase.from("service_items").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("service_items").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}

export async function deleteServiceItem(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("service_items").delete().eq("id", id);
  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}

const STARTER = [
  { label: "Landing page", price: 300 },
  { label: "Multi-page website", price: 600 },
  { label: "Contact form", price: 80 },
  { label: "Booking (Calendly / Cal.com)", price: 120 },
  { label: "Login / user accounts", price: 250 },
  { label: "Stripe checkout / payments", price: 200 },
  { label: "Blog / CMS", price: 180 },
  { label: "Multi-language", price: 150 },
  { label: "SEO setup", price: 120 },
  { label: "Analytics setup", price: 60 },
  { label: "Redesign (existing site)", price: 350 },
];

export async function addStarterFeatures() {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("service_items")
    .insert(STARTER.map((s) => ({ label: s.label, price: s.price, currency: "EUR", category: "Website" })));
  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}
