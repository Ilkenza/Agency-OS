"use client";

import { useActionState } from "react";
import { saveTool, deleteTool, type ToolFormState } from "@/app/(app)/toolbox/actions";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Tool } from "@/lib/types";

export function ToolForm({ tool, categories = [] }: { tool?: Tool; categories?: string[] }) {
  const [state, formAction, pending] = useActionState<ToolFormState, FormData>(saveTool, undefined);

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {tool && <input type="hidden" name="id" value={tool.id} />}

        <Field
          label="Name"
          name="name"
          defaultValue={tool?.name ?? ""}
          placeholder="Vercel"
          autoFocus
          required
        />
        <Field
          label="URL"
          name="url"
          type="url"
          defaultValue={tool?.url ?? ""}
          placeholder="https://vercel.com"
        />
        <Field
          label="Category"
          name="category"
          defaultValue={tool?.category ?? ""}
          placeholder="Hosting"
          list="tool-categories"
          help="Izaberi postojeću ili upiši novu (npr. Hosting, Database, Email…)."
        />
        <datalist id="tool-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <Textarea
          label="Notes"
          name="notes"
          defaultValue={tool?.notes ?? ""}
          placeholder="What you use it for…"
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : tool ? "Save changes" : "Add tool"}
        </Button>
      </form>

      {tool && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteTool.bind(null, tool.id)}
            label="Delete tool"
            confirmText={`Delete "${tool.name}"?`}
          />
        </div>
      )}
    </div>
  );
}
