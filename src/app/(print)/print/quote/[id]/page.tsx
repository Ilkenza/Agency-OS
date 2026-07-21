import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuote } from "@/lib/data/quotes";
import { getProfile } from "@/lib/data/profile";
import { quoteTotal } from "@/lib/quotes/total";
import { formatMoney, formatDate } from "@/lib/format";
import { PrintButton } from "@/components/invoices/PrintButton";

export default async function PrintQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) notFound();

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
  const total = quoteTotal(quote.items);

  return (
    <div className="mx-auto max-w-180 bg-white p-10 shadow-sm print:max-w-none print:p-0 print:shadow-none">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div
            className="text-[28px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quote
          </div>
          <div className="mono mt-1 text-sm text-neutral-500">
            {quote.title}
          </div>
        </div>
        <PrintButton />
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
            Prepared for
          </div>
          <div className="mt-1 font-semibold">{quote.client?.name ?? "—"}</div>
          <div className="mono mt-1 text-xs text-neutral-400">
            {formatDate(quote.created_at)}
          </div>
        </div>
      </div>

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-wide text-neutral-400">
            <th className="py-2 font-bold">Item</th>
            <th className="py-2 text-right font-bold">Price</th>
            <th className="py-2 text-right font-bold">Qty</th>
            <th className="py-2 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {quote.items.map((it, i) => (
            <tr key={i} className="border-b border-neutral-100">
              <td className="py-3">{it.label}</td>
              <td className="mono py-3 text-right">
                {formatMoney(it.price, quote.currency)}
              </td>
              <td className="mono py-3 text-right">{it.qty}</td>
              <td className="mono py-3 text-right">
                {formatMoney(it.price * it.qty, quote.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between border-t-2 border-neutral-900 pt-3">
            <span className="font-bold">Total</span>
            <span className="mono font-bold">
              {formatMoney(total, quote.currency)}
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
