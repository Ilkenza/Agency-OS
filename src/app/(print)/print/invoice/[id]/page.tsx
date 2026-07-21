import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInvoice } from "@/lib/data/invoices";
import { getProfile } from "@/lib/data/profile";
import { effectiveInvoiceStatus } from "@/lib/status";
import { formatMoney, formatDate } from "@/lib/format";
import { quoteTotal } from "@/lib/quotes/total";
import { PrintButton } from "@/components/invoices/PrintButton";

export default async function PrintInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile();

  const fromName =
    profile?.business_name ||
    profile?.full_name ||
    user?.email ||
    "Your business";
  const fromEmail = profile?.business_email || user?.email || "";

  const status = effectiveInvoiceStatus(invoice);
  const currency = invoice.currency;

  // Fall back to a single "Services" line when the invoice has no itemized breakdown.
  const lines =
    invoice.items.length > 0
      ? invoice.items
      : [
          {
            label: `Services${invoice.client?.name ? ` — ${invoice.client.name}` : ""}`,
            price: invoice.amount,
            qty: 1,
          },
        ];
  const subtotal =
    invoice.items.length > 0 ? quoteTotal(invoice.items) : invoice.amount;
  const amountDue = status === "paid" ? 0 : invoice.amount;

  return (
    <div className="mx-auto max-w-180 bg-white p-10 text-neutral-900 shadow-sm print:max-w-none print:p-0 print:shadow-none">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div
            className="text-[26px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invoice
          </div>
          <div className="mono mt-1 text-sm text-neutral-500">
            {invoice.number ?? "—"}
          </div>
        </div>
        <PrintButton />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 text-sm">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Date of issue
          </div>
          <div className="mono mt-1">{formatDate(invoice.issued_at)}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Date due
          </div>
          <div className="mono mt-1">{formatDate(invoice.due_date)}</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            From
          </div>
          <div className="mt-1 font-semibold">{fromName}</div>
          {fromEmail && (
            <div className="text-sm text-neutral-500">{fromEmail}</div>
          )}
          {profile?.business_address && (
            <div className="mt-1 whitespace-pre-wrap text-sm text-neutral-500">
              {profile.business_address}
            </div>
          )}
          {profile?.vat_id && (
            <div className="mono mt-1 text-xs text-neutral-400">
              VAT / PIB: {profile.vat_id}
            </div>
          )}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Bill to
          </div>
          <div className="mt-1 font-semibold">
            {invoice.client?.name ?? "—"}
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Status
          </div>
          <div className="mt-0.5 text-sm capitalize">{status}</div>
        </div>
      </div>

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-wide text-neutral-400">
            <th className="py-2 font-bold">Description</th>
            <th className="py-2 text-right font-bold">Qty</th>
            <th className="py-2 text-right font-bold">Unit price</th>
            <th className="py-2 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((it, i) => (
            <tr key={i} className="border-b border-neutral-100">
              <td className="py-3 pr-2">{it.label}</td>
              <td className="mono py-3 text-right">{it.qty}</td>
              <td className="mono py-3 text-right">
                {formatMoney(it.price, currency)}
              </td>
              <td className="mono py-3 text-right">
                {formatMoney(it.price * it.qty, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-neutral-500">Subtotal</span>
            <span className="mono">{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 py-1">
            <span className="text-neutral-500">Total</span>
            <span className="mono">
              {formatMoney(invoice.amount, currency)}
            </span>
          </div>
          <div className="flex justify-between border-t-2 border-neutral-900 pt-2">
            <span className="font-bold">Amount due</span>
            <span className="mono font-bold">
              {formatMoney(amountDue, currency)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-12 text-xs text-neutral-400">
        Generated with Zevern.
      </p>
    </div>
  );
}
