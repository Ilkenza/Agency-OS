"use client";

import { useActionState } from "react";
import {
  saveTemplate,
  deleteTemplate,
  type TemplateFormState,
} from "@/app/(app)/leads/templates/actions";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { OutreachTemplate } from "@/lib/types";

export function TemplateForm({ template }: { template?: OutreachTemplate }) {
  const [state, formAction, pending] = useActionState<TemplateFormState, FormData>(
    saveTemplate,
    undefined,
  );

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {template && <input type="hidden" name="id" value={template.id} />}

        <Field
          label="Title"
          name="title"
          defaultValue={template?.title ?? ""}
          placeholder="Cold outreach — web redesign"
          autoFocus
          required
        />
        <Textarea
          label="Message"
          name="body"
          rows={10}
          defaultValue={template?.body ?? ""}
          placeholder="Hi {name}, I came across {company} and…"
        />
        <p className="mb-3 -mt-1 text-[11.5px] text-muted">
          Variables filled per lead:{" "}
          <code className="mono">{"{name}"}</code> <code className="mono">{"{company}"}</code>{" "}
          <code className="mono">{"{contact}"}</code> <code className="mono">{"{service}"}</code>
        </p>

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : template ? "Save changes" : "Create template"}
        </Button>
      </form>

      {template && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteTemplate.bind(null, template.id)}
            label="Delete template"
            confirmText={`Delete "${template.title}"?`}
          />
        </div>
      )}
    </div>
  );
}
