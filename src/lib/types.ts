import type { Tables } from "./database.types";

export type Client = Tables<"clients">;
export type Project = Tables<"projects">;
export type Task = Tables<"tasks">;
export type Invoice = Tables<"invoices">;
export type SeoCheck = Tables<"seo_checks">;
export type Lead = Tables<"leads">;
export type OutreachTemplate = Tables<"outreach_templates">;
export type ServiceItem = Tables<"service_items">;
export type Quote = Tables<"quotes">;
export type Tool = Tables<"tools">;

export type QuoteItem = { label: string; price: number; qty: number };

export type QuoteWithClient = Omit<Quote, "items"> & {
  items: QuoteItem[];
  client: { name: string } | null;
};

export type CheckStatus = "pass" | "warn" | "fail";
export type CheckResult = {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
  found?: string;
};

export type ProjectWithClient = Project & { client: { name: string } | null };

export type TaskWithProject = Task & {
  project: { title: string; client: { name: string } | null } | null;
};

export type InvoiceWithClient = Omit<Invoice, "items"> & {
  items: QuoteItem[];
  client: { name: string } | null;
};

export type SeoCheckWithProject = Omit<SeoCheck, "results"> & {
  results: CheckResult[];
  project: { title: string } | null;
};
