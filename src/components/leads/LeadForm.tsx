"use client";

import { useActionState } from "react";
import { saveLead, deleteLead, type LeadFormState } from "@/app/(app)/leads/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { LEAD_STATUS_OPTIONS, CHANNEL_OPTIONS } from "@/lib/status";
import type { Lead } from "@/lib/types";

export function LeadForm({ lead }: { lead?: Lead }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(
    saveLead,
    undefined,
  );

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {lead && <input type="hidden" name="id" value={lead.id} />}

        <Field
          label="Name"
          name="name"
          defaultValue={lead?.name ?? ""}
          placeholder="Person or business"
          autoFocus
          required
        />
        <Field
          label="Company"
          name="company"
          defaultValue={lead?.company ?? ""}
          placeholder="Company (optional)"
        />
        <Field
          label="Contact"
          name="contact"
          defaultValue={lead?.contact ?? ""}
          placeholder="email · phone · @handle"
        />
        <Select
          label="Channel"
          name="channel"
          defaultValue={lead?.channel ?? ""}
          placeholder="—"
          options={CHANNEL_OPTIONS}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={lead?.status ?? "new"}
          options={LEAD_STATUS_OPTIONS}
        />
        <Field
          label="Est. value (€)"
          name="value"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          defaultValue={lead ? String(lead.value) : ""}
          placeholder="500"
        />
        <Field
          label="Last contacted"
          name="last_contact_at"
          type="date"
          defaultValue={lead?.last_contact_at ?? ""}
        />
        <Field
          label="Next follow-up"
          name="next_followup"
          type="date"
          defaultValue={lead?.next_followup ?? ""}
        />
        <Textarea
          label="Notes"
          name="notes"
          defaultValue={lead?.notes ?? ""}
          placeholder="What you offered, their reply, next step…"
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : lead ? "Save changes" : "Create lead"}
        </Button>
      </form>

      {lead && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteLead.bind(null, lead.id)}
            label="Delete lead"
            confirmText={`Delete "${lead.name}"?`}
          />
        </div>
      )}
    </div>
  );
}
