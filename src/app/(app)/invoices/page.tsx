import { getInvoices, getInvoice, nextInvoiceNumber } from "@/lib/data/invoices";
import { getClients } from "@/lib/data/clients";
import { InvoicesView, type InvoicesPanel } from "@/components/invoices/InvoicesView";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const [invoices, clients, suggestedNumber] = await Promise.all([
    getInvoices(),
    getClients(),
    nextInvoiceNumber(),
  ]);

  let panel: InvoicesPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const invoice = await getInvoice(params.edit);
    if (invoice) panel = { mode: "edit", invoice };
  }

  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));

  return (
    <InvoicesView
      invoices={invoices}
      clients={clientOptions}
      suggestedNumber={suggestedNumber}
      panel={panel}
    />
  );
}
