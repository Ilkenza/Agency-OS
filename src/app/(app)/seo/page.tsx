import { getChecks } from "@/lib/data/seo";
import { getProjects } from "@/lib/data/projects";
import { SeoView } from "@/components/seo/SeoView";

export default async function SeoPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; url?: string }>;
}) {
  const params = await searchParams;
  const [checks, projects] = await Promise.all([getChecks(), getProjects()]);
  const projectOptions = projects.map((p) => ({ id: p.id, title: p.title }));

  const panelOpen = Boolean(params.new || params.url);

  return (
    <SeoView
      checks={checks}
      projects={projectOptions}
      panelOpen={panelOpen}
      initialUrl={params.url}
    />
  );
}
