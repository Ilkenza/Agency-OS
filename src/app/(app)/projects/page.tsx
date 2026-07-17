import { getProjects, getProject } from "@/lib/data/projects";
import { getClients } from "@/lib/data/clients";
import { ProjectsView, type ProjectsPanel } from "@/components/projects/ProjectsView";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);

  let panel: ProjectsPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const project = await getProject(params.edit);
    if (project) panel = { mode: "edit", project };
  }

  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name, region: c.region }));

  return <ProjectsView projects={projects} clients={clientOptions} panel={panel} />;
}
