"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ListChecks, Pencil } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { priorityBadge } from "@/lib/status";
import { formatDate, isToday, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task, TaskWithProject } from "@/lib/types";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskForm, type ProjectOption } from "./TaskForm";

export type TasksPanel = { mode: "new" } | { mode: "edit"; task: Task } | null;

function TaskRow({ task }: { task: TaskWithProject }) {
  const done = task.status === "done";
  const pb = priorityBadge(task.priority);
  return (
    <div className="group flex items-center gap-3 border-b border-line-soft px-4 py-3 last:border-b-0 hover:bg-white/[0.02]">
      <TaskCheckbox id={task.id} done={done} />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-[13.5px] font-medium",
            done ? "text-faint line-through" : "text-ink",
          )}
        >
          {task.title}
        </div>
        {task.project?.title && (
          <Link
            href={`/projects/${task.project_id}`}
            className="text-[11.5px] text-muted hover:text-gold-hi"
          >
            {task.project.title}
          </Link>
        )}
      </div>
      {!done && <Badge status={pb.variant}>{pb.label}</Badge>}
      <span className="mono w-[92px] shrink-0 text-right text-[12px] text-muted">
        {formatDate(task.due_at)}
      </span>
      <Link
        href={`/tasks?edit=${task.id}`}
        aria-label={`Edit ${task.title}`}
        className="inline-flex rounded-ctrl p-1.5 text-faint opacity-0 transition-opacity hover:bg-white/[0.05] hover:text-ink group-hover:opacity-100"
      >
        <Pencil className="h-[15px] w-[15px]" />
      </Link>
    </div>
  );
}

function Section({
  title,
  accent,
  tasks,
}: {
  title: string;
  accent: string;
  tasks: TaskWithProject[];
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-line-soft bg-white/[0.015] px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.07em]">
        <span className={accent}>{title}</span>
        <span className="mono text-faint">{tasks.length}</span>
      </div>
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </div>
  );
}

export function TasksView({
  tasks,
  projects,
  panel,
}: {
  tasks: TaskWithProject[];
  projects: ProjectOption[];
  panel: TasksPanel;
}) {
  const router = useRouter();
  const close = () => router.push("/tasks");

  const open = tasks.filter((t) => t.status === "todo");
  const done = tasks.filter((t) => t.status === "done");

  const overdue = open.filter((t) => isOverdue(t.due_at));
  const today = open.filter((t) => isToday(t.due_at));
  const upcoming = open.filter((t) => t.due_at && !isOverdue(t.due_at) && !isToday(t.due_at));
  const noDate = open.filter((t) => !t.due_at);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          Tasks
        </h1>
        <Link href="/tasks?new=1" className={buttonClasses("primary")}>
          <Plus className="h-4 w-4" />
          New task
        </Link>
      </div>

      <Panel>
        {tasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description="Add a task, set a priority and a due date to see it here."
            action={
              <Link href="/tasks?new=1" className={buttonClasses("primary")}>
                New task
              </Link>
            }
          />
        ) : (
          <div>
            <Section title="Overdue" accent="text-danger" tasks={overdue} />
            <Section title="Today" accent="text-gold" tasks={today} />
            <Section title="Upcoming" accent="text-muted" tasks={upcoming} />
            <Section title="No date" accent="text-muted" tasks={noDate} />
            <Section title="Done" accent="text-faint" tasks={done} />
          </div>
        )}
      </Panel>

      <SlideOver
        open={panel !== null}
        onClose={close}
        title={panel?.mode === "edit" ? "Edit task" : "New task"}
      >
        <TaskForm task={panel?.mode === "edit" ? panel.task : undefined} projects={projects} />
      </SlideOver>
    </div>
  );
}
