import {
  LayoutDashboard,
  Send,
  FolderKanban,
  ListChecks,
  Users,
  ReceiptText,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type CountKey = "projects" | "tasks" | "clients" | "invoices" | "seo" | "leads";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  countKey?: CountKey;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Send, countKey: "leads" },
  { label: "Projects", href: "/projects", icon: FolderKanban, countKey: "projects" },
  { label: "Tasks", href: "/tasks", icon: ListChecks, countKey: "tasks" },
  { label: "Clients", href: "/clients", icon: Users, countKey: "clients" },
  { label: "Invoices", href: "/invoices", icon: ReceiptText, countKey: "invoices" },
  { label: "SEO / GEO", href: "/seo", icon: Sparkles, countKey: "seo" },
  { label: "Settings", href: "/settings", icon: Settings },
];

export type NavCounts = Partial<Record<CountKey, number>>;

/** New-menu destinations for the topbar `+ New` button. */
export const NEW_ITEMS: { label: string; href: string }[] = [
  { label: "New lead", href: "/leads?new=1" },
  { label: "New client", href: "/clients?new=1" },
  { label: "New project", href: "/projects?new=1" },
  { label: "New task", href: "/tasks?new=1" },
  { label: "New invoice", href: "/invoices?new=1" },
  { label: "New SEO check", href: "/seo?new=1" },
];
