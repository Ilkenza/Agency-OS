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

// Svaki feature ima domaću (RSD) i stranu (EUR) cenu.
const STARTER = [
  { label: "Landing page", eur: 300, rsd: 25000 },
  { label: "Multi-page website", eur: 600, rsd: 55000 },
  { label: "Contact form", eur: 80, rsd: 6000 },
  { label: "Booking (Calendly / Cal.com)", eur: 120, rsd: 10000 },
  { label: "Login / user accounts", eur: 250, rsd: 22000 },
  { label: "Stripe checkout / payments", eur: 200, rsd: 18000 },
  { label: "Blog / CMS", eur: 180, rsd: 15000 },
  { label: "Multi-language", eur: 150, rsd: 12000 },
  { label: "SEO setup", eur: 120, rsd: 10000 },
  { label: "Analytics setup", eur: 60, rsd: 5000 },
  { label: "Redesign (existing site)", eur: 350, rsd: 30000 },
];

export async function addStarterFeatures() {
  const supabase = await createSupabaseServerClient();
  const rows = STARTER.flatMap((s) => [
    { label: s.label, price: s.rsd, currency: "RSD", category: "Domaći (RSD)" },
    { label: s.label, price: s.eur, currency: "EUR", category: "Strani (EUR)" },
  ]);
  await supabase.from("service_items").insert(rows);
  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}
