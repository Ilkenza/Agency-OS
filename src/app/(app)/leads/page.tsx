import { getLeads, getLead } from "@/lib/data/leads";
import { LeadsView, type LeadsPanel } from "@/components/leads/LeadsView";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const leads = await getLeads();

  let panel: LeadsPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const lead = await getLead(params.edit);
    if (lead) panel = { mode: "edit", lead };
  }

  return <LeadsView leads={leads} panel={panel} />;
}
