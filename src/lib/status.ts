import type { BadgeStatus } from "@/components/ui/Badge";
import { isOverdue } from "@/lib/format";

export const PROJECT_STATUSES = ["draft", "pending", "in_progress", "delivered"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "delivered", label: "Delivered" },
];

/** Map a project status to a Badge variant + human label. */
export function projectStatusBadge(status: string): { variant: BadgeStatus; label: string } {
  switch (status) {
    case "in_progress":
      return { variant: "active", label: "In progress" };
    case "delivered":
      return { variant: "ok", label: "Delivered" };
    case "pending":
      return { variant: "info", label: "Pending" };
    default:
      return { variant: "draft", label: "Draft" };
  }
}

export const CLIENT_REGION_OPTIONS: { value: string; label: string }[] = [
  { value: "domestic", label: "Domaći (RSD)" },
  { value: "foreign", label: "Strani (EUR/USD)" },
];

export const CLIENT_TIER_OPTIONS: { value: string; label: string }[] = [
  { value: "osnovni", label: "Osnovni" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

/** Client tier → Badge variant + label (for list/detail chips). */
export function clientTierBadge(tier: string | null): { variant: BadgeStatus; label: string } | null {
  switch (tier) {
    case "premium":
      return { variant: "ok", label: "Premium" };
    case "standard":
      return { variant: "info", label: "Standard" };
    case "osnovni":
      return { variant: "draft", label: "Osnovni" };
    default:
      return null;
  }
}

export const TASK_PRIORITIES = ["low", "med", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "med", label: "Medium" },
  { value: "high", label: "High" },
];

/** Priority badge. Gold/`active` stays reserved for the "in progress" status, not priority. */
export function priorityBadge(priority: string): { variant: BadgeStatus; label: string } {
  switch (priority) {
    case "high":
      return { variant: "danger", label: "High" };
    case "low":
      return { variant: "draft", label: "Low" };
    default:
      return { variant: "pending", label: "Medium" };
  }
}

export const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

/** A `sent` invoice past its due date reads as overdue without changing the stored status. */
export function effectiveInvoiceStatus(inv: { status: string; due_date: string | null }): string {
  if (inv.status === "sent" && isOverdue(inv.due_date)) return "overdue";
  return inv.status;
}

export function invoiceStatusBadge(status: string): { variant: BadgeStatus; label: string } {
  switch (status) {
    case "paid":
      return { variant: "ok", label: "Paid" };
    case "sent":
      return { variant: "pending", label: "Sent" };
    case "overdue":
      return { variant: "danger", label: "Overdue" };
    default:
      return { variant: "draft", label: "Draft" };
  }
}

/** SEO check score → Badge variant + label. */
export function scoreBadge(score: number): { variant: BadgeStatus; label: string } {
  if (score >= 80) return { variant: "ok", label: "Good" };
  if (score >= 50) return { variant: "pending", label: "Fair" };
  return { variant: "danger", label: "Poor" };
}

/** pass/warn/fail finding → text color + label (component picks the icon). */
export function checkStatusMeta(status: string): { color: string; label: string } {
  switch (status) {
    case "pass":
      return { color: "text-ok", label: "Pass" };
    case "fail":
      return { color: "text-danger", label: "Fail" };
    default:
      return { color: "text-pending", label: "Warn" };
  }
}

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "seen",
  "replied",
  "negotiating",
  "waiting",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "seen", label: "Seen" },
  { value: "replied", label: "Replied" },
  { value: "negotiating", label: "Negotiating" },
  { value: "waiting", label: "Čeka (sajt u izradi)" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function leadStatusBadge(status: string): { variant: BadgeStatus; label: string } {
  switch (status) {
    case "won":
      return { variant: "ok", label: "Won" };
    case "lost":
      return { variant: "danger", label: "Lost" };
    case "replied":
      return { variant: "active", label: "Replied" };
    case "negotiating":
      return { variant: "active", label: "Negotiating" };
    case "seen":
      return { variant: "active", label: "Seen" };
    case "waiting":
      return { variant: "info", label: "Čeka" };
    case "contacted":
      return { variant: "pending", label: "Contacted" };
    default:
      return { variant: "draft", label: "New" };
  }
}

export const CHANNEL_OPTIONS: { value: string; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "instagram", label: "Instagram" },
  { value: "google_maps", label: "Google Maps" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
  { value: "other", label: "Other" },
];

/** What you pitched a lead (website work). */
export const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "new_site", label: "New site" },
  { value: "redesign", label: "Redesign" },
  { value: "fix", label: "Site fix" },
];

export function serviceLabel(service: string | null | undefined): string | null {
  if (!service) return null;
  const found = SERVICE_OPTIONS.find((s) => s.value === service);
  return found ? found.label : service;
}

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "RSD", label: "RSD (дин)" },
];

export const QUOTE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export function quoteStatusBadge(status: string): { variant: BadgeStatus; label: string } {
  switch (status) {
    case "accepted":
      return { variant: "ok", label: "Accepted" };
    case "declined":
      return { variant: "danger", label: "Declined" };
    case "sent":
      return { variant: "pending", label: "Sent" };
    default:
      return { variant: "draft", label: "Draft" };
  }
}
