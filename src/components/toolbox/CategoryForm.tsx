"use client";

import { useActionState } from "react";
import {
  renameCategory,
  deleteCategory,
  type CategoryState,
} from "@/app/(app)/toolbox/actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";

export function CategoryForm({ name }: { name: string }) {
  const [state, formAction, pending] = useActionState<CategoryState, FormData>(
    renameCategory,
    undefined,
  );

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        <input type="hidden" name="old" value={name} />
        <Field
          label="Naziv kategorije"
          name="name"
          defaultValue={name}
          autoFocus
          required
          help="Preimenuje se na svim alatima u ovoj kategoriji."
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <div className="mt-4 border-t border-line pt-4">
        <DeleteButton
          action={deleteCategory.bind(null, name)}
          label="Delete category"
          confirmText={`Obrisati kategoriju "${name}"? Alati ostaju, samo bez kategorije.`}
        />
      </div>
    </div>
  );
}
