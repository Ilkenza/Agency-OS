import { getTasks, getTask } from "@/lib/data/tasks";
import { getProjects } from "@/lib/data/projects";
import { TasksView, type TasksPanel } from "@/components/tasks/TasksView";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);

  let panel: TasksPanel = null;
  if (params.new) {
    panel = { mode: "new" };
  } else if (params.edit) {
    const task = await getTask(params.edit);
    if (task) panel = { mode: "edit", task };
  }

  const projectOptions = projects.map((p) => ({
    id: p.id,
    title: p.title,
    client: p.client?.name ?? null,
  }));

  return <TasksView tasks={tasks} projects={projectOptions} panel={panel} />;
}
