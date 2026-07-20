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
  { value: "domestic", label: "Domestic (RSD)" },
  { value: "foreign", label: "International (EUR/USD)" },
];

export const CLIENT_TIER_OPTIONS: { value: string; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

/** Rough price range per tier (typical whole-site project) — guidance in the client form. */
export const TIER_PRICE_HINTS: Record<string, { domestic: string; foreign: string }> = {
  basic: { domestic: "30–70k RSD", foreign: "500–1000 €" },
  standard: { domestic: "70–140k RSD", foreign: "1000–2000 €" },
  premium: { domestic: "140–300k RSD", foreign: "2000–4000 €" },
};

/** Price-range hint for a tier, shown for the client's region (or both if unknown). */
export function tierPriceHint(tier: string, region: string): string {
  const h = TIER_PRICE_HINTS[tier];
  if (!h) return "";
  if (region === "domestic") return `Domestic: ${h.domestic}`;
  if (region === "foreign") return `Foreign: ${h.foreign}`;
  return `Domestic ${h.domestic} · Foreign ${h.foreign}`;
}

export function clientTierBadge(tier: string | null): { variant: BadgeStatus; label: string } | null {
  switch (tier) {
    case "premium":
      return { variant: "ok", label: "Premium" };
    case "standard":
      return { variant: "info", label: "Standard" };
    case "basic":
      return { variant: "draft", label: "Basic" };
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

export function scoreBadge(score: number): { variant: BadgeStatus; label: string } {
  if (score >= 80) return { variant: "ok", label: "Good" };
  if (score >= 50) return { variant: "pending", label: "Fair" };
  return { variant: "danger", label: "Poor" };
}

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
  "interested",
  "follow_up_soon",
  "negotiating",
  "waiting",
  "maybe",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "seen", label: "Seen" },
  { value: "replied", label: "Replied" },
  { value: "interested", label: "Interested" },
  { value: "follow_up_soon", label: "Follow up soon" },
  { value: "negotiating", label: "Negotiating" },
  { value: "waiting", label: "Awaiting their site" },
  { value: "maybe", label: "Maybe later" },
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
    case "interested":
      return { variant: "active", label: "Interested" };
    case "follow_up_soon":
      return { variant: "info", label: "Follow up soon" };
    case "negotiating":
      return { variant: "active", label: "Negotiating" };
    case "seen":
      return { variant: "active", label: "Seen" };
    case "waiting":
      return { variant: "info", label: "Awaiting site" };
    case "maybe":
      return { variant: "draft", label: "Maybe later" };
    case "contacted":
      return { variant: "pending", label: "Contacted" };
    default:
      return { variant: "draft", label: "New" };
  }
}

export const CHANNEL_OPTIONS: { value: string; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "google_maps", label: "Google Maps" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
  { value: "other", label: "Other" },
];

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
