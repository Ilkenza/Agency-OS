"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type ServiceItemState = { error?: string } | undefined;

/** Parse an optional price field: empty → null, invalid/negative → error sentinel (NaN). */
function parsePrice(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) || n < 0 ? NaN : n;
}

export async function saveServiceItem(
  _prev: ServiceItemState,
  formData: FormData,
): Promise<ServiceItemState> {
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const priceRsd = parsePrice(String(formData.get("price_rsd") ?? ""));
  const priceEur = parsePrice(String(formData.get("price_eur") ?? ""));
  const priceUsd = parsePrice(String(formData.get("price_usd") ?? ""));

  if (!label) return { error: "Label is required." };
  if ([priceRsd, priceEur, priceUsd].some((p) => Number.isNaN(p)))
    return { error: "Cene moraju biti pozitivni brojevi." };

  const supabase = await createSupabaseServerClient();
  const payload = {
    label,
    category,
    price_rsd: priceRsd,
    price_eur: priceEur,
    price_usd: priceUsd,
  };

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

// Bazna cena (nivo "Osnovni") po feature-u i valuti. RSD za domaće, EUR/USD za strane klijente.
const STARTER = [
  { label: "Landing page (one-pager)", rsd: 30000, eur: 400, usd: 430 },
  { label: "Multi-page website (do 5 str.)", rsd: 70000, eur: 900, usd: 980 },
  { label: "Dodatna stranica", rsd: 9000, eur: 120, usd: 130 },
  { label: "Contact form", rsd: 8000, eur: 100, usd: 110 },
  { label: "Booking (Calendly / Cal.com)", rsd: 12000, eur: 150, usd: 160 },
  { label: "Login / user accounts", rsd: 35000, eur: 350, usd: 380 },
  { label: "Stripe checkout / payments", rsd: 30000, eur: 300, usd: 330 },
  { label: "Blog / CMS", rsd: 25000, eur: 250, usd: 270 },
  { label: "Multi-language", rsd: 18000, eur: 200, usd: 220 },
  { label: "SEO setup", rsd: 15000, eur: 180, usd: 200 },
  { label: "Analytics setup", rsd: 6000, eur: 80, usd: 90 },
  { label: "Animacije / micro-interakcije", rsd: 16000, eur: 200, usd: 220 },
  { label: "Redesign (postojeći sajt)", rsd: 45000, eur: 500, usd: 550 },
  { label: "Održavanje (mesečno)", rsd: 8000, eur: 100, usd: 110 },
];

// Nivoi po tipu klijenta (množilac na baznu "Osnovni" cenu).
const TIERS = [
  { name: "Osnovni", mult: 1 },
  { name: "Standard", mult: 1.6 },
  { name: "Premium", mult: 2.5 },
];

// Zaokruži: RSD na 500, EUR/USD na 10 — da cene budu "čiste".
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export async function addStarterFeatures() {
  const supabase = await createSupabaseServerClient();
  // Očisti prethodne seed serije (sve verzije) da nema duplikata pri ponovnom pokretanju.
  await supabase
    .from("service_items")
    .delete()
    .in("category", ["Website", "Osnovni", "Standard", "Premium"]);
  await supabase.from("service_items").delete().like("category", "Domaći — %");
  await supabase.from("service_items").delete().like("category", "Strani — %");

  const rows = STARTER.flatMap((s) =>
    TIERS.map((t) => ({
      label: s.label,
      category: t.name,
      price_rsd: roundTo(s.rsd * t.mult, 500),
      price_eur: roundTo(s.eur * t.mult, 10),
      price_usd: roundTo(s.usd * t.mult, 10),
    })),
  );
  await supabase.from("service_items").insert(rows);
  revalidatePath("/quotes/catalog");
  redirect("/quotes/catalog");
}
