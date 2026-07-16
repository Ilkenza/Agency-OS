"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Send, Pencil, Search, FileText, Upload, Download } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { LEAD_STATUS_OPTIONS, SERVICE_OPTIONS, leadStatusBadge, serviceLabel } from "@/lib/status";
import { formatCurrency, formatDate, isToday, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/types";
import { LeadForm } from "./LeadForm";

export type LeadsPanel = { mode: "new" } | { mode: "edit"; lead: Lead } | null;

// Columns match the leads import (parse-import.ts) so an export can be re-imported.
const EXPORT_COLUMNS = [
  "name",
  "company",
  "contact",
  "channel",
  "service",
  "status",
  "value",
  "next_followup",
  "notes",
] as const;

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function exportLeadsCsv(leads: Lead[]) {
  const head = EXPORT_COLUMNS.join(",");
  const rows = leads.map((l) =>
    EXPORT_COLUMNS.map((c) => csvCell((l as Record<string, unknown>)[c])).join(","),
  );
  const csv = "﻿" + [head, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agency-os-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function LeadRow({ lead }: { lead: Lead }) {
  const badge = leadStatusBadge(lead.status);
  const open = lead.status !== "won" && lead.status !== "lost";
  const followColor =
    open && isOverdue(lead.next_followup)
      ? "text-danger"
      : open && isToday(lead.next_followup)
        ? "text-gold"
        : "text-muted";
  return (
    <div className="group flex items-center gap-3 border-b border-line-soft px-4 py-3 last:border-b-0 hover:bg-white/[0.02]">
      <div className="min-w-0 flex-1">
        <Link href={`/leads/${lead.id}`} className="text-[13.5px] font-semibold text-ink hover:text-gold-hi">
          {lead.name}
        </Link>
        <div className="truncate text-[11.5px] text-muted">
          {[lead.company, lead.channel, serviceLabel(lead.service)].filter(Boolean).join(" · ") ||
            "—"}
        </div>
      </div>
      <Badge status={badge.variant}>{badge.label}</Badge>
      <span className="mono hidden w-[70px] shrink-0 text-right text-[12px] text-ink sm:block">
        {lead.value > 0 ? formatCurrency(lead.value) : "—"}
      </span>
      <span className={cn("mono w-[92px] shrink-0 text-right text-[12px]", followColor)}>
        {formatDate(lead.next_followup)}
      </span>
      <Link
        href={`/leads?edit=${lead.id}`}
        aria-label={`Edit ${lead.name}`}
        className="inline-flex rounded-ctrl p-1.5 text-faint opacity-0 transition-opacity hover:bg-white/[0.05] hover:text-ink group-hover:opacity-100"
      >
        <Pencil className="h-[15px] w-[15px]" />
      </Link>
    </div>
  );
}

function Section({ label, leads }: { label: string; leads: Lead[] }) {
  if (leads.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-line-soft bg-white/[0.015] px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
        <span>{label}</span>
        <span className="mono text-faint">{leads.length}</span>
      </div>
      {leads.map((l) => (
        <LeadRow key={l.id} lead={l} />
      ))}
    </div>
  );
}

export function LeadsView({ leads, panel }: { leads: Lead[]; panel: LeadsPanel }) {
  const router = useRouter();
  const close = () => router.push("/leads");
  const [q, setQ] = useState("");
  const [serviceF, setServiceF] = useState("");
  const [statusF, setStatusF] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const term = q.trim().toLowerCase();
  const filtered = leads.filter((l) => {
    if (term && ![l.name, l.company, l.contact].some((v) => v?.toLowerCase().includes(term)))
      return false;
    if (serviceF && l.service !== serviceF) return false;
    if (statusF && l.status !== statusF) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "value":
        return (b.value ?? 0) - (a.value ?? 0);
      case "followup":
        return (a.next_followup ?? "9999-12-31").localeCompare(b.next_followup ?? "9999-12-31");
      default:
        return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    }
  });

  const selectClass =
    "rounded-ctrl border border-line bg-white/[0.035] px-2.5 py-2 text-[12.5px] text-ink [color-scheme:dark] focus:border-gold focus:outline-none";
  const optClass = "bg-[#1A1D24] text-[#ECEEF2]";

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">Leads</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search leads…"
              aria-label="Search leads"
              className="w-[200px] rounded-ctrl border border-line bg-white/[0.035] py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-faint focus:border-gold focus:outline-none"
            />
          </div>
          <Link href="/leads/import" className={buttonClasses("secondary")}>
            <Upload className="h-4 w-4" />
            Import
          </Link>
          <button
            type="button"
            onClick={() => exportLeadsCsv(leads)}
            disabled={leads.length === 0}
            className={buttonClasses("secondary")}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link href="/leads/templates" className={buttonClasses("secondary")}>
            <FileText className="h-4 w-4" />
            Templates
          </Link>
          <Link href="/leads?new=1" className={buttonClasses("primary")}>
            <Plus className="h-4 w-4" />
            New lead
          </Link>
        </div>
      </div>

      {leads.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            aria-label="Filter by status"
            className={selectClass}
          >
            <option value="" className={optClass}>
              All statuses
            </option>
            {LEAD_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className={optClass}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={serviceF}
            onChange={(e) => setServiceF(e.target.value)}
            aria-label="Filter by service"
            className={selectClass}
          >
            <option value="" className={optClass}>
              All services
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className={optClass}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort"
            className={selectClass}
          >
            <option value="newest" className={optClass}>
              Newest first
            </option>
            <option value="name" className={optClass}>
              Name A–Z
            </option>
            <option value="value" className={optClass}>
              Value (high→low)
            </option>
            <option value="followup" className={optClass}>
              Follow-up (soonest)
            </option>
          </select>

          {(statusF || serviceF || q) && (
            <span className="mono text-[11.5px] text-faint">{sorted.length} shown</span>
          )}
        </div>
      )}

      <Panel>
        {leads.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No leads yet"
            description="Add prospects you're pitching and track who replied and what's next."
            action={
              <Link href="/leads?new=1" className={buttonClasses("primary")}>
                New lead
              </Link>
            }
          />
        ) : sorted.length === 0 ? (
          <EmptyState icon={Search} title="No matches" description="Try clearing filters or search." />
        ) : (
          <div>
            {LEAD_STATUS_OPTIONS.map((s) => (
              <Section
                key={s.value}
                label={s.label}
                leads={sorted.filter((l) => l.status === s.value)}
              />
            ))}
          </div>
        )}
      </Panel>

      <SlideOver
        open={panel !== null}
        onClose={close}
        title={panel?.mode === "edit" ? "Edit lead" : "New lead"}
      >
        <LeadForm lead={panel?.mode === "edit" ? panel.lead : undefined} />
      </SlideOver>
    </div>
  );
}
