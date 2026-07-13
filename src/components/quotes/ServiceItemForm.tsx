"use client";

import { useActionState } from "react";
import {
  saveServiceItem,
  deleteServiceItem,
  type ServiceItemState,
} from "@/app/(app)/quotes/catalog/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { CURRENCY_OPTIONS } from "@/lib/status";
import type { ServiceItem } from "@/lib/types";

export function ServiceItemForm({ item }: { item?: ServiceItem }) {
  const [state, formAction, pending] = useActionState<ServiceItemState, FormData>(
    saveServiceItem,
    undefined,
  );

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {item && <input type="hidden" name="id" value={item.id} />}

        <Field
          label="Label"
          name="label"
          defaultValue={item?.label ?? ""}
          placeholder="Contact form"
          autoFocus
          required
        />
        <Field
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          defaultValue={item ? String(item.price) : ""}
          placeholder="120"
        />
        <Select
          label="Currency"
          name="currency"
          defaultValue={item?.currency ?? "EUR"}
          options={CURRENCY_OPTIONS}
        />
        <Field
          label="Category"
          name="category"
          defaultValue={item?.category ?? ""}
          placeholder="Website"
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : item ? "Save changes" : "Add feature"}
        </Button>
      </form>

      {item && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteServiceItem.bind(null, item.id)}
            label="Delete feature"
            confirmText={`Delete "${item.label}"?`}
          />
        </div>
      )}
    </div>
  );
}
