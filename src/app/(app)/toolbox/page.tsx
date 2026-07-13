import { getTools, getTool } from "@/lib/data/tools";
import { ToolboxView, type ToolboxPanel } from "@/components/toolbox/ToolboxView";

export default async function ToolboxPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const tools = await getTools();

  let panel: ToolboxPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const tool = await getTool(params.edit);
    if (tool) panel = { mode: "edit", tool };
  }

  return <ToolboxView tools={tools} panel={panel} />;
}
