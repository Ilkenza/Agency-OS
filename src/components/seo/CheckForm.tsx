"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
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
        type="text"
        inputMode="url"
        defaultValue={initialUrl ?? ""}
        placeholder="example.com"
        help="No need to type https:// — it's added automatically."
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
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning…
          </>
        ) : (
          "Run check"
        )}
      </Button>
      <div className="mt-3 space-y-2 rounded-ctrl border border-line-soft bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-muted">
        <p>
          <span className="font-semibold text-ink">SEO</span> = how easily search engines (Google)
          find you: title, description, headings, images, mobile view…
        </p>
        <p>
          <span className="font-semibold text-ink">GEO</span> = how easily AI tools (ChatGPT, Gemini)
          understand you: structure, JSON-LD data, Open Graph. We fetch the page and score both.
        </p>
      </div>
    </form>
  );
}
