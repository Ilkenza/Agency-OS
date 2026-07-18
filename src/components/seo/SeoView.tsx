"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { scoreBadge } from "@/lib/status";
import { formatRelativeTime } from "@/lib/format";
import type { SeoCheckWithProject } from "@/lib/types";
import { CheckForm, type ProjectOption } from "./CheckForm";

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SeoView({
  checks,
  projects,
  panelOpen,
  initialUrl,
}: {
  checks: SeoCheckWithProject[];
  projects: ProjectOption[];
  panelOpen: boolean;
  initialUrl?: string;
}) {
  const router = useRouter();
  const close = () => router.push("/seo");

  return (
    <div className="mx-auto max-w-300">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          SEO / GEO
        </h1>
        <Link href="/seo?new=1" className={buttonClasses("primary")}>
          <Plus className="h-4 w-4" />
          New check
        </Link>
      </div>

      <Panel>
        {checks.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No checks yet"
            description="Run an on-page SEO + AI/GEO readiness check on any URL."
            action={
              <Link href="/seo?new=1" className={buttonClasses("primary")}>
                New check
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className="border-b border-line-soft px-4 py-2.75 text-left text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Site
                  </th>
                  <th className="border-b border-line-soft px-4 py-2.75 text-left text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Title
                  </th>
                  <th className="border-b border-line-soft px-4 py-2.75 text-left text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Score
                  </th>
                  <th className="border-b border-line-soft px-4 py-2.75 text-right text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                    Checked
                  </th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c) => {
                  const badge = scoreBadge(c.score);
                  return (
                    <tr
                      key={c.id}
                      className="transition-colors hover:bg-white/2"
                    >
                      <td className="border-b border-line-soft px-4 py-3 font-semibold text-ink">
                        <Link
                          href={`/seo/${c.id}`}
                          className="hover:text-gold-hi"
                        >
                          {domainOf(c.url)}
                        </Link>
                      </td>
                      <td className="max-w-70 truncate border-b border-line-soft px-4 py-3 text-muted">
                        {c.title ?? "—"}
                      </td>
                      <td className="border-b border-line-soft px-4 py-3">
                        <Badge status={badge.variant}>
                          <span className="mono">{c.score}</span> ·{" "}
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="mono border-b border-line-soft px-4 py-3 text-right text-muted">
                        {formatRelativeTime(c.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <SlideOver open={panelOpen} onClose={close} title="New check">
        <CheckForm projects={projects} initialUrl={initialUrl} />
      </SlideOver>
    </div>
  );
}
