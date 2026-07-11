"use client";

import { useActionState } from "react";
import { saveTask, deleteTask, type TaskFormState } from "@/app/(app)/tasks/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { PRIORITY_OPTIONS } from "@/lib/status";
import type { Task } from "@/lib/types";

export type ProjectOption = { id: string; title: string };

export function TaskForm({ task, projects }: { task?: Task; projects: ProjectOption[] }) {
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(
    saveTask,
    undefined,
  );

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.title }));

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {task && <input type="hidden" name="id" value={task.id} />}

        <Field
          label="Title"
          name="title"
          defaultValue={task?.title ?? ""}
          placeholder="Follow up with client"
          autoFocus
          required
        />

        <Select
          label="Project"
          name="project_id"
          defaultValue={task?.project_id ?? ""}
          placeholder={projectOptions.length ? "No project" : "No projects yet"}
          options={projectOptions}
        />

        <Select
          label="Priority"
          name="priority"
          defaultValue={task?.priority ?? "med"}
          options={PRIORITY_OPTIONS}
        />

        <Field label="Due date" name="due_at" type="date" defaultValue={task?.due_at ?? ""} />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : task ? "Save changes" : "Create task"}
        </Button>
      </form>

      {task && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteTask.bind(null, task.id)}
            label="Delete task"
            confirmText={`Delete "${task.title}"?`}
          />
        </div>
      )}
    </div>
  );
}
