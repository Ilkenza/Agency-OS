"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { INVOICE_STATUSES, type InvoiceStatus } from "@/lib/status";

export type InvoiceFormState = { error?: string } | undefined;

export async function saveInvoice(
  _prev: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim() || null;
  const number = String(formData.get("number") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft");
  const currencyRaw = String(formData.get("currency") ?? "EUR");
  const currency = ["EUR", "USD", "RSD"].includes(currencyRaw) ? currencyRaw : "EUR";
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const issuedAt = String(formData.get("issued_at") ?? "").trim() || null;
  const dueDate = String(formData.get("due_date") ?? "").trim() || null;

  if (!INVOICE_STATUSES.includes(status as InvoiceStatus)) return { error: "Invalid status." };

  const amount = amountRaw ? Number(amountRaw) : 0;
  if (Number.isNaN(amount) || amount < 0) return { error: "Amount must be a positive number." };

  const supabase = await createSupabaseServerClient();
  const payload = {
    client_id: clientId,
    number,
    amount,
    currency,
    status,
    issued_at: issuedAt,
    due_date: dueDate,
  };

  if (id) {
    const { error } = await supabase.from("invoices").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("invoices").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/invoices");
  revalidatePath("/");
  redirect("/invoices");
}

export async function deleteInvoice(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("invoices").delete().eq("id", id);
  revalidatePath("/invoices");
  revalidatePath("/");
  redirect("/invoices");
}
