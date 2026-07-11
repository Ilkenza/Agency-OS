import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, RotateCw, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { getCheck } from "@/lib/data/seo";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { deleteCheck } from "../actions";
import { scoreBadge, checkStatusMeta } from "@/lib/status";
import { formatDate } from "@/lib/format";
import type { CheckResult } from "@/lib/types";

const ICONS = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle } as const;

export default async function CheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const check = await getCheck(id);
  if (!check) notFound();

  const badge = scoreBadge(check.score);
  const scoreColor =
    check.score >= 80 ? "text-ok" : check.score >= 50 ? "text-gold" : "text-danger";

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <Link
        href="/seo"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        SEO / GEO
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {check.title && (
            <h1 className="truncate font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
              {check.title}
            </h1>
          )}
          <a
            href={check.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mono mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-gold-hi hover:underline"
          >
            {check.url}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="mono mt-1 text-[11.5px] text-faint">Checked {formatDate(check.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/seo?url=${encodeURIComponent(check.url)}`}
            className={buttonClasses("secondary")}
          >
            <RotateCw className="h-4 w-4" />
            Check again
          </Link>
          <DeleteButton action={deleteCheck.bind(null, check.id)} confirmText="Delete this check?" />
        </div>
      </div>

      <div className="flex items-center gap-6 rounded-card border border-line bg-surface px-6 py-5">
        <div className="text-center">
          <div className={`mono text-[40px] font-bold leading-none ${scoreColor}`}>
            {check.score}
          </div>
          <div className="mt-1 text-[11px] text-faint">/ 100</div>
        </div>
        <div>
          <Badge status={badge.variant}>{badge.label}</Badge>
          <p className="mt-2 text-[12.5px] text-muted">
            On-page SEO + AI/GEO readiness across {check.results.length} checks.
          </p>
        </div>
      </div>

      <Panel title="Findings">
        <div>
          {check.results.map((r: CheckResult) => {
            const meta = checkStatusMeta(r.status);
            const Icon = ICONS[r.status] ?? AlertTriangle;
            return (
              <div
                key={r.key}
                className="flex items-start gap-3 border-b border-line-soft px-4 py-3 last:border-b-0"
              >
                <Icon className={`mt-0.5 h-[17px] w-[17px] shrink-0 ${meta.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink">{r.label}</div>
                  <div className="text-[12px] text-muted">{r.detail}</div>
                </div>
                <span className={`shrink-0 text-[11px] font-semibold uppercase ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
