import { getServiceItems, getServiceItem } from "@/lib/data/catalog";
import { CatalogView, type CatalogPanel } from "@/components/quotes/CatalogView";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const items = await getServiceItems();

  let panel: CatalogPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const item = await getServiceItem(params.edit);
    if (item) panel = { mode: "edit", item };
  }

  return <CatalogView items={items} panel={panel} />;
}
