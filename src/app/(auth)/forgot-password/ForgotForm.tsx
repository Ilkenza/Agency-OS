"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthState } from "../actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ForgotForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    undefined,
  );

  return (
    <div className="rounded-card border border-line bg-surface/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <form action={formAction}>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          required
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p className="mb-3 rounded-ctrl border border-ok/40 bg-ok-bg px-3 py-2 text-[12px] text-ok">
            {state.message}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
