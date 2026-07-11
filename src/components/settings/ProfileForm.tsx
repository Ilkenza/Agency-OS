"use client";

import { useActionState } from "react";
import { saveProfile, type SettingsState } from "@/app/(app)/settings/actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/lib/data/profile";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    saveProfile,
    undefined,
  );

  return (
    <form action={formAction} className="px-4 py-4">
      <Field label="Full name" name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Your name" />
      <Field
        label="Handle"
        name="handle"
        defaultValue={profile?.handle ?? ""}
        placeholder="ilkenza"
        help="A unique username."
      />

      {state?.error && (
        <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="mb-3 rounded-ctrl border border-ok/40 bg-ok-bg px-3 py-2 text-[12px] text-ok">
          Profile saved.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
