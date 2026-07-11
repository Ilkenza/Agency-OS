import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInvoice } from "@/lib/data/invoices";
import { getProfile } from "@/lib/data/profile";
import { effectiveInvoiceStatus } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
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
    profile?.business_name || profile?.full_name || user?.email || "Your business";
  const fromEmail = profile?.business_email || user?.email || "";

  const status = effectiveInvoiceStatus(invoice);

  return (
    <div className="mx-auto max-w-[720px] bg-white p-10 shadow-sm print:max-w-none print:p-0 print:shadow-none">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div
            className="text-[28px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invoice
          </div>
          <div className="mono mt-1 text-sm text-neutral-500">{invoice.number ?? "—"}</div>
        </div>
        <PrintButton />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">From</div>
          <div className="mt-1 font-semibold">{fromName}</div>
          {fromEmail && <div className="text-sm text-neutral-500">{fromEmail}</div>}
          {profile?.business_address && (
            <div className="mt-1 whitespace-pre-wrap text-sm text-neutral-500">
              {profile.business_address}
            </div>
          )}
          {profile?.vat_id && (
            <div className="mono mt-1 text-xs text-neutral-400">VAT / PIB: {profile.vat_id}</div>
          )}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Bill to
          </div>
          <div className="mt-1 font-semibold">{invoice.client?.name ?? "—"}</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4 border-y border-neutral-200 py-4 text-sm">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Issued
          </div>
          <div className="mono mt-1">{formatDate(invoice.issued_at)}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Due</div>
          <div className="mono mt-1">{formatDate(invoice.due_date)}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Status
          </div>
          <div className="mt-1 capitalize">{status}</div>
        </div>
      </div>

      <table className="mb-8 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-wide text-neutral-400">
            <th className="py-2 font-bold">Description</th>
            <th className="py-2 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3">
              Services{invoice.client?.name ? ` — ${invoice.client.name}` : ""}
            </td>
            <td className="mono py-3 text-right">{formatCurrency(invoice.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-56">
          <div className="flex justify-between border-t-2 border-neutral-900 pt-3">
            <span className="font-bold">Total</span>
            <span className="mono font-bold">{formatCurrency(invoice.amount)}</span>
          </div>
        </div>
      </div>

      <p className="mt-12 text-xs text-neutral-400">Generated with Agency OS.</p>
    </div>
  );
}
