import { getClientsWithCounts, getClient } from "@/lib/data/clients";
import { ClientsView, type ClientsPanel } from "@/components/clients/ClientsView";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const clients = await getClientsWithCounts();

  let panel: ClientsPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const client = await getClient(params.edit);
    if (client) panel = { mode: "edit", client };
  }

  return <ClientsView clients={clients} panel={panel} />;
}
