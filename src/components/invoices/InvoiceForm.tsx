"use client";

import { useActionState } from "react";
import { saveInvoice, deleteInvoice, type InvoiceFormState } from "@/app/(app)/invoices/actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { INVOICE_STATUS_OPTIONS } from "@/lib/status";
import { todayISO } from "@/lib/format";
import type { Invoice } from "@/lib/types";

export type ClientOption = { id: string; name: string };

export function InvoiceForm({
  invoice,
  clients,
  suggestedNumber,
}: {
  invoice?: Invoice;
  clients: ClientOption[];
  suggestedNumber: string;
}) {
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(
    saveInvoice,
    undefined,
  );

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="flex h-full flex-col">
      <form action={formAction} className="flex-1">
        {invoice && <input type="hidden" name="id" value={invoice.id} />}

        <Field
          label="Invoice number"
          name="number"
          defaultValue={invoice?.number ?? suggestedNumber}
          placeholder="2026-001"
        />

        <Select
          label="Client"
          name="client_id"
          defaultValue={invoice?.client_id ?? ""}
          placeholder={clientOptions.length ? "No client" : "No clients yet"}
          options={clientOptions}
        />

        <Field
          label="Amount (€)"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          defaultValue={invoice ? String(invoice.amount) : ""}
          placeholder="500"
          autoFocus
        />

        <Select
          label="Status"
          name="status"
          defaultValue={invoice?.status ?? "draft"}
          options={INVOICE_STATUS_OPTIONS}
        />

        <Field
          label="Issued"
          name="issued_at"
          type="date"
          defaultValue={invoice?.issued_at ?? (invoice ? "" : todayISO())}
        />

        <Field
          label="Due date"
          name="due_date"
          type="date"
          defaultValue={invoice?.due_date ?? ""}
        />

        {state?.error && (
          <p className="mb-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Saving…" : invoice ? "Save changes" : "Create invoice"}
        </Button>
      </form>

      {invoice && (
        <div className="mt-4 border-t border-line pt-4">
          <DeleteButton
            action={deleteInvoice.bind(null, invoice.id)}
            label="Delete invoice"
            confirmText={`Delete invoice ${invoice.number ?? ""}?`}
          />
        </div>
      )}
    </div>
  );
}
