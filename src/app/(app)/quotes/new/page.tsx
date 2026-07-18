import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClients } from "@/lib/data/clients";
import { getServiceItems } from "@/lib/data/catalog";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";

export default async function NewQuotePage() {
  const [clients, catalog] = await Promise.all([
    getClients(),
    getServiceItems(),
  ]);
  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-225">
      <Link
        href="/quotes"
        className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Quotes
      </Link>
      <h1 className="mb-4 font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
        New quote
      </h1>
      <QuoteBuilder clients={clientOptions} catalog={catalog} />
    </div>
  );
}
