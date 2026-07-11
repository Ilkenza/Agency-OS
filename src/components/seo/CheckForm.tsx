"use client";

import { useActionState } from "react";
import { runCheck, type CheckFormState } from "@/app/(app)/seo/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export type ProjectOption = { id: string; title: string };

export function CheckForm({
  projects,
  initialUrl,
}: {
  projects: ProjectOption[];
  initialUrl?: string;
}) {
  const [state, formAction, pending] = useActionState<CheckFormState, FormData>(
    runCheck,
    undefined,
  );

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.title }));

  return (
    <form action={formAction}>
      <Field
        label="URL"
        name="url"
        type="url"
        defaultValue={initialUrl ?? ""}
        placeholder="https://example.com"
        autoFocus
        required
      />

      <Select
        label="Project (optional)"
        name="project_id"
        defaultValue=""
        placeholder={projectOptions.length ? "No project" : "No projects yet"}
        options={projectOptions}
      />

      {state?.error && (
        <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Checking…" : "Run check"}
      </Button>
      <p className="mt-2 text-[11.5px] text-muted">
        We fetch the page and score on-page SEO + AI/GEO readiness.
      </p>
    </form>
  );
}
