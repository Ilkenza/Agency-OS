"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/app/(app)/settings/actions";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function DangerZone() {
  const [ack, setAck] = useState(false);

  return (
    <div className="px-4 py-4">
      <p className="text-[13px] text-muted">
        Permanently delete your account and everything in it — clients,
        projects, tasks, invoices, leads and SEO checks. This cannot be undone.
      </p>

      <label className="mt-3 flex items-start gap-2 text-[12.5px] text-muted">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-0.5 accent-[#DE6B5E]"
        />
        I understand this permanently deletes my account and all data.
      </label>

      <form
        action={deleteAccount}
        onSubmit={(e) => {
          if (
            !ack ||
            !window.confirm(
              "Delete your account and ALL data? This cannot be undone.",
            )
          ) {
            e.preventDefault();
          }
        }}
        className="mt-3"
      >
        <button
          type="submit"
          disabled={!ack}
          className={cn(
            buttonClasses("danger"),
            !ack && "cursor-not-allowed opacity-50",
          )}
        >
          <Trash2 className="h-4 w-4" />
          Delete account
        </button>
      </form>
    </div>
  );
}
