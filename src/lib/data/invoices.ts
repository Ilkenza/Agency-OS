import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/format";
import { effectiveInvoiceStatus } from "@/lib/status";
import type { InvoiceWithClient } from "@/lib/types";

const WITH_CLIENT = "*, client:clients(name)";

export async function getInvoices(): Promise<InvoiceWithClient[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select(WITH_CLIENT)
    .order("issued_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as InvoiceWithClient[];
}

export async function getRecentInvoices(limit = 5): Promise<InvoiceWithClient[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select(WITH_CLIENT)
    .order("issued_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as InvoiceWithClient[];
}

export async function getInvoice(id: string): Promise<InvoiceWithClient | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("invoices").select(WITH_CLIENT).eq("id", id).maybeSingle();
  return (data as InvoiceWithClient | null) ?? null;
}

export async function getInvoiceCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
  return count ?? 0;
}

/** Suggests `YYYY-NNN` for the next invoice. */
export async function nextInvoiceNumber(): Promise<string> {
  const count = await getInvoiceCount();
  return `${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
}

export type InvoiceStats = {
  revenueThisMonth: number;
  outstanding: number;
  overdueCount: number;
};

export async function getInvoiceStats(): Promise<InvoiceStats> {
  const supabase = await createClient();
  const { data } = await supabase.from("invoices").select("amount, status, issued_at, due_date");
  const rows = data ?? [];
  const month = todayISO().slice(0, 7);

  let revenueThisMonth = 0;
  let outstanding = 0;
  let overdueCount = 0;

  for (const inv of rows) {
    const amount = Number(inv.amount) || 0;
    const eff = effectiveInvoiceStatus(inv);
    if (inv.status === "paid" && inv.issued_at?.slice(0, 7) === month) {
      revenueThisMonth += amount;
    }
    if (eff === "sent" || eff === "overdue") {
      outstanding += amount;
    }
    if (eff === "overdue") {
      overdueCount += 1;
    }
  }

  return { revenueThisMonth, outstanding, overdueCount };
}
