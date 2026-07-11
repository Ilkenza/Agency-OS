"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ResetForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <div className="rounded-card border border-line bg-surface/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <form action={formAction}>
        <Field
          label="New password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={6}
          required
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Updating…" : "Set new password"}
        </Button>
      </form>
    </div>
  );
}
