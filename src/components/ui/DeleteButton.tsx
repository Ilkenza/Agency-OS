"use client";

import { Trash2 } from "lucide-react";
import { buttonClasses } from "./Button";

/**
 * Standalone delete form with a native confirm() guard. Pass a server action
 * already bound to the record id, e.g. deleteClient.bind(null, id).
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
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={buttonClasses("danger")}>
        <Trash2 className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
