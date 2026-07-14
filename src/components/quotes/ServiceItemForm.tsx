"use client";

import { useActionState } from "react";
import {
  saveServiceItem,
  deleteServiceItem,
  type ServiceItemState,
} from "@/app/(app)/quotes/catalog/actions";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { ServiceItem } from "@/lib/types";

const priceStr = (v: number | null | undefined) => (v == null ? "" : String(v));

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
          label="Category"
          name="category"
          defaultValue={item?.category ?? ""}
          placeholder="Website"
        />

        <div className="mb-1.5 text-xs font-semibold text-[#C6CAD6]">Cene po valuti</div>
        <div className="grid grid-cols-3 gap-x-3">
          <Field
            label="RSD"
            name="price_rsd"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={priceStr(item?.price_rsd)}
            placeholder="12000"
          />
          <Field
            label="EUR"
            name="price_eur"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={priceStr(item?.price_eur)}
            placeholder="120"
          />
          <Field
            label="USD"
            name="price_usd"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={priceStr(item?.price_usd)}
            placeholder="130"
          />
        </div>
        <p className="mb-3 text-[11.5px] text-muted">
          Popuni cenu za valute koje koristiš — ostavi prazno ako ne nudiš u toj valuti.
        </p>

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
