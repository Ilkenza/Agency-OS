"use client";

import { useActionState, useState } from "react";
import { saveClient, deleteClient, type ClientFormState } from "@/app/(app)/clients/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import {
  CLIENT_REGION_OPTIONS,
  CLIENT_TIER_OPTIONS,
  CHANNEL_OPTIONS,
  TIER_PRICE_HINTS,
} from "@/lib/status";
import type { Client } from "@/lib/types";

export function ClientForm({
  client,
  businessTypes = [],
}: {
  client?: Client;
  businessTypes?: string[];
}) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(
    saveClient,
    undefined,
  );
  const [tier, setTier] = useState(client?.tier ?? "");
  const [businessType, setBusinessType] = useState(client?.business_type ?? "");

  const tierHelp = tier
    ? TIER_PRICE_HINTS[tier]
    : "Basic / Standard / Premium — sets your usual price range.";

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
        <Select
          label="Contact channel"
          name="contact_channel"
          defaultValue={client?.contact_channel ?? ""}
          placeholder="Select…"
          options={CHANNEL_OPTIONS}
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
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            placeholder="Select…"
            options={CLIENT_TIER_OPTIONS}
            help={tierHelp}
          />
        </div>

        <Field
          label="Business type"
          name="business_type"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="bakery, gym, clinic…"
          help="Type a new one or click an existing type below."
        />
        {businessTypes.length > 0 && (
          <div className="mb-[13px] -mt-1 flex flex-wrap gap-1.5">
            {businessTypes.map((t) => {
              const active = t.toLowerCase() === businessType.trim().toLowerCase();
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBusinessType(t)}
                  className={`rounded-pill border px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                    active
                      ? "border-gold bg-gold/15 text-gold-hi"
                      : "border-line text-muted hover:border-muted hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

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
