"use client";

import { useActionState } from "react";
import { saveClient, deleteClient, type ClientFormState } from "@/app/(app)/clients/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { CLIENT_REGION_OPTIONS, CLIENT_TIER_OPTIONS } from "@/lib/status";
import type { Client } from "@/lib/types";

export function ClientForm({ client }: { client?: Client }) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(
    saveClient,
    undefined,
  );

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {client && <input type="hidden" name="id" value={client.id} />}
        <Field
          label="Business name"
          name="name"
          defaultValue={client?.name ?? ""}
          placeholder="Prestige Real Estate"
          autoFocus
          required
        />
        <Field
          label="Owner / contact person"
          name="contact"
          defaultValue={client?.contact ?? ""}
          placeholder="e.g. John Miller"
        />
        <Field
          label="Contact channel"
          name="contact_channel"
          defaultValue={client?.contact_channel ?? ""}
          placeholder="Instagram @user · email · phone"
          help="How you're in touch / where you connected."
        />
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Select
            label="Region"
            name="region"
            defaultValue={client?.region ?? ""}
            placeholder="Select…"
            options={CLIENT_REGION_OPTIONS}
            help="Sets the currency for quotes/projects."
          />
          <Select
            label="Tier"
            name="tier"
            defaultValue={client?.tier ?? ""}
            placeholder="Select…"
            options={CLIENT_TIER_OPTIONS}
          />
        </div>
        <Field
          label="Business type"
          name="business_type"
          defaultValue={client?.business_type ?? ""}
          placeholder="bakery, gym, clinic…"
        />
        <Textarea
          label="Notes"
          name="notes"
          defaultValue={client?.notes ?? ""}
          placeholder="Anything worth remembering…"
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : client ? "Save changes" : "Create client"}
        </Button>
      </form>

      {client && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteClient.bind(null, client.id)}
            label="Delete client"
            confirmText={`Delete "${client.name}"? Its projects stay but lose this client.`}
          />
        </div>
      )}
    </div>
  );
}
