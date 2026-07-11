"use client";

import { useActionState } from "react";
import { saveClient, deleteClient, type ClientFormState } from "@/app/(app)/clients/actions";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
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
          label="Name"
          name="name"
          defaultValue={client?.name ?? ""}
          placeholder="Prestige Nekretnine"
          autoFocus
          required
        />
        <Field
          label="Contact"
          name="contact"
          defaultValue={client?.contact ?? ""}
          placeholder="email · phone · person"
          help="Company or contact person."
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
