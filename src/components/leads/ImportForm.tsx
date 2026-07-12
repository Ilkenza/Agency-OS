"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { importLeads, type ImportState } from "@/app/(app)/leads/actions";
import { Button, buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TEMPLATE =
  "name,company,contact,channel,service,status,value,next_followup,notes\n" +
  "Milan Jovanović,Kafe Kod Mike,@milan,instagram,new_site,contacted,800,2026-08-01,Poslao ponudu\n" +
  "Ana Petrović,Studio Ana,@ana,instagram,redesign,new,1200,,Nije još odgovorila";

function downloadTemplate() {
  const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function ImportForm() {
  const [state, formAction, pending] = useActionState<ImportState, FormData>(
    importLeads,
    undefined,
  );

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-line bg-surface p-4 text-[12.5px] text-muted">
        <p className="mb-2 font-semibold text-ink">How it works</p>
        <p>
          Paste your leads below — either as CSV, or copy a range straight from Excel / Google
          Sheets (it pastes as tab-separated). The first row must be the header.
        </p>
        <ul className="mt-3 space-y-1">
          <li>
            <span className="mono text-ink">name</span> — required (person or business)
          </li>
          <li>
            <span className="mono text-ink">company, contact, notes</span> — free text (optional)
          </li>
          <li>
            <span className="mono text-ink">channel</span> — email · instagram · linkedin ·
            whatsapp · phone · other
          </li>
          <li>
            <span className="mono text-ink">service</span> — new_site · redesign · fix (what you
            pitched)
          </li>
          <li>
            <span className="mono text-ink">status</span> — new · contacted · replied ·
            negotiating · won · lost (default: new)
          </li>
          <li>
            <span className="mono text-ink">value</span> — number in € · <span className="mono text-ink">next_followup</span> — date{" "}
            <span className="mono">YYYY-MM-DD</span>
          </li>
        </ul>
        <button
          type="button"
          onClick={downloadTemplate}
          className={cn(buttonClasses("secondary"), "mt-3 h-8 px-3 text-[12px]")}
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV template
        </button>
      </div>

      <form action={formAction}>
        <textarea
          name="data"
          rows={12}
          required
          placeholder={"name,company,contact,channel,status,value,next_followup,notes\n…"}
          className="mono w-full resize-y rounded-ctrl border border-line bg-white/[0.035] px-3 py-2.5 text-[12px] text-ink placeholder:text-faint focus:border-gold focus:outline-none"
        />

        {state?.error && (
          <p className="mt-3 rounded-ctrl border border-danger/40 bg-danger-bg px-3 py-2 text-[12px] text-danger">
            {state.error}
          </p>
        )}
        {typeof state?.imported === "number" && (
          <div className="mt-3 rounded-ctrl border border-ok/40 bg-ok-bg px-3 py-2 text-[12px] text-ok">
            Imported {state.imported} lead{state.imported === 1 ? "" : "s"}
            {state.skipped ? ` · skipped ${state.skipped} empty row(s)` : ""}.{" "}
            <Link href="/leads" className="font-semibold underline">
              View leads
            </Link>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Importing…" : "Import leads"}
          </Button>
          <Link href="/leads" className={buttonClasses("secondary")}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
