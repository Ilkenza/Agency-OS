import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImportForm } from "@/components/leads/ImportForm";

export default function ImportLeadsPage() {
  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Leads
      </Link>

      <h1 className="mb-4 mt-3 font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
        Import leads
      </h1>

      <ImportForm />
    </div>
  );
}
