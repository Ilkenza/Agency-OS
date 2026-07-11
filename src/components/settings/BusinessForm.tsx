"use client";

import { useActionState } from "react";
import { saveBusiness, type SettingsState } from "@/app/(app)/settings/actions";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/lib/data/profile";

export function BusinessForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    saveBusiness,
    undefined,
  );

  return (
    <form action={formAction} className="px-4 py-4">
      <p className="mb-3 text-[12px] text-muted">Shown as the “From” details on your invoices.</p>

      <Field
        label="Business name"
        name="business_name"
        defaultValue={profile?.business_name ?? ""}
        placeholder="Solverk Studio"
      />
      <Field
        label="Business email"
        name="business_email"
        type="email"
        defaultValue={profile?.business_email ?? ""}
        placeholder="hello@solverk.com"
      />
      <Textarea
        label="Address"
        name="business_address"
        defaultValue={profile?.business_address ?? ""}
        placeholder="Street, city, country"
      />
      <Field
        label="VAT / Tax ID (PIB)"
        name="vat_id"
        defaultValue={profile?.vat_id ?? ""}
        placeholder="RS123456789"
      />

      {state?.error && (
        <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="mb-3 rounded-ctrl border border-ok/40 bg-ok-bg px-3 py-2 text-[12px] text-ok">
          Business details saved.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Save business details"}
      </Button>
    </form>
  );
}
