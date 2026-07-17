"use client";

import { useActionState, useState } from "react";
import { saveProject, deleteProject, type ProjectFormState } from "@/app/(app)/projects/actions";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { PROJECT_STATUS_OPTIONS, CURRENCY_OPTIONS } from "@/lib/status";
import type { Project } from "@/lib/types";

export type ClientOption = { id: string; name: string; region: string | null };

export function ProjectForm({
  project,
  clients,
}: {
  project?: Project;
  clients: ClientOption[];
}) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    saveProject,
    undefined,
  );

  const [clientId, setClientId] = useState(project?.client_id ?? "");
  const [currency, setCurrency] = useState(project?.currency ?? "EUR");

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));

  // Pick a client → default the currency from its region (existing projects keep their currency).
  const onClientChange = (id: string) => {
    setClientId(id);
    const region = clients.find((c) => c.id === id)?.region;
    if (region === "domestic") setCurrency("RSD");
    else if (region === "foreign") setCurrency("EUR");
  };

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {project && <input type="hidden" name="id" value={project.id} />}

        <Field
          label="Title"
          name="title"
          defaultValue={project?.title ?? ""}
          placeholder="Catalog site"
          autoFocus
          required
        />

        <Select
          label="Client"
          name="client_id"
          value={clientId}
          onChange={(e) => onClientChange(e.target.value)}
          placeholder={clientOptions.length ? "No client" : "No clients yet"}
          options={clientOptions}
          help={clientOptions.length ? undefined : "Add a client first to link this project."}
        />

        <Select
          label="Status"
          name="status"
          defaultValue={project?.status ?? "draft"}
          options={PROJECT_STATUS_OPTIONS}
        />

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field
            label="Value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={project ? String(project.value) : ""}
            placeholder="500"
          />
          <Select
            label="Currency"
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={CURRENCY_OPTIONS}
          />
        </div>

        <Field
          label="Due date"
          name="due_date"
          type="date"
          defaultValue={project?.due_date ?? ""}
        />

        <Textarea
          label="Description"
          name="description"
          defaultValue={project?.description ?? ""}
          placeholder="Scope, deliverables…"
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : project ? "Save changes" : "Create project"}
        </Button>
      </form>

      {project && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteProject.bind(null, project.id)}
            label="Delete project"
            confirmText={`Delete "${project.title}"?`}
          />
        </div>
      )}
    </div>
  );
}
