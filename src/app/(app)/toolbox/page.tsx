import { getTools, getTool, getCategories } from "@/lib/data/tools";
import { ToolboxView, type ToolboxPanel } from "@/components/toolbox/ToolboxView";

export default async function ToolboxPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const [tools, categories] = await Promise.all([getTools(), getCategories()]);

  let panel: ToolboxPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const tool = await getTool(params.edit);
    if (tool) panel = { mode: "edit", tool };
  } else if (params.cat) {
    panel = { mode: "category", name: params.cat };
  }

  return <ToolboxView tools={tools} categories={categories} panel={panel} />;
}
