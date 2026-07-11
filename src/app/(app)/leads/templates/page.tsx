import { getTemplates, getTemplate } from "@/lib/data/templates";
import { TemplatesView, type TemplatesPanel } from "@/components/templates/TemplatesView";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const templates = await getTemplates();

  let panel: TemplatesPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const template = await getTemplate(params.edit);
    if (template) panel = { mode: "edit", template };
  }

  return <TemplatesView templates={templates} panel={panel} />;
}
