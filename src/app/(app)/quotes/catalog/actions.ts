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

// Bazna cena (nivo "Osnovni") po feature-u, posebno za domaće (RSD) i strane (EUR) klijente.
// Strane baze su premium (zapadno tržište), domaće prilagođene srpskom tržištu.
const STARTER = [
  { label: "Landing page (one-pager)", eur: 400, rsd: 30000 },
  { label: "Multi-page website (do 5 str.)", eur: 900, rsd: 70000 },
  { label: "Dodatna stranica", eur: 120, rsd: 9000 },
  { label: "Contact form", eur: 100, rsd: 8000 },
  { label: "Booking (Calendly / Cal.com)", eur: 150, rsd: 12000 },
  { label: "Login / user accounts", eur: 350, rsd: 35000 },
  { label: "Stripe checkout / payments", eur: 300, rsd: 30000 },
  { label: "Blog / CMS", eur: 250, rsd: 25000 },
  { label: "Multi-language", eur: 200, rsd: 18000 },
  { label: "SEO setup", eur: 180, rsd: 15000 },
  { label: "Analytics setup", eur: 80, rsd: 6000 },
  { label: "Animacije / micro-interakcije", eur: 200, rsd: 16000 },
  { label: "Redesign (postojeći sajt)", eur: 500, rsd: 45000 },
  { label: "Održavanje (mesečno)", eur: 100, rsd: 8000 },
];

// Nivoi po tipu klijenta (množilac na baznu "Osnovni" cenu).
const TIERS = [
  { name: "Osnovni", mult: 1 },
  { name: "Standard", mult: 1.6 },
  { name: "Premium", mult: 2.5 },
];

// Zaokruži: RSD na 500, EUR na 10 — da cene budu "čiste".
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export async function addStarterFeatures() {
  const supabase = await createSupabaseServerClient();
  const rows = STARTER.flatMap((s) =>
    TIERS.flatMap((t) => [
      {
        label: s.label,
        price: roundTo(s.rsd * t.mult, 500),
        currency: "RSD",
        category: `Domaći — ${t.name}`,
      },
      {
        label: s.label,
        price: roundTo(s.eur * t.mult, 10),
        currency: "EUR",
        category: `Strani — ${t.name}`,
      },
    ]),
  );
  await supabase.from("service_items").insert(rows);
  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}
