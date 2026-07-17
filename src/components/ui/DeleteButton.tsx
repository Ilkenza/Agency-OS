"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { buttonClasses } from "./Button";

/**
 * Delete button with an in-app confirmation dialog (no blocking native confirm()).
 * Pass a server action already bound to the record id, e.g. deleteClient.bind(null, id).
 */
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this permanently? This cannot be undone.",
}: {
  action: () => void | Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  const confirm = () => {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClasses("danger")}>
        <Trash2 className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative w-full max-w-[380px] rounded-card border border-line bg-surface p-5 shadow-2xl">
            <div className="text-[14px] font-semibold text-ink">Confirm delete</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{confirmText}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className={buttonClasses("secondary")}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={pending}
                className={buttonClasses("danger")}
              >
                <Trash2 className="h-4 w-4" />
                {pending ? "Deleting…" : label}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
