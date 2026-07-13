import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getQuote } from "@/lib/data/quotes";
import { getClients } from "@/lib/data/clients";
import { getServiceItems } from "@/lib/data/catalog";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quote, clients, catalog] = await Promise.all([
    getQuote(id),
    getClients(),
    getServiceItems(),
  ]);
  if (!quote) notFound();
  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-[900px]">
      <Link
        href={`/quotes/${quote.id}`}
        className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <h1 className="mb-4 font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
        Edit quote
      </h1>
      <QuoteBuilder quote={quote} clients={clientOptions} catalog={catalog} />
    </div>
  );
}
