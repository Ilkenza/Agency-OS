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

/** One line on a quote (stored in quotes.items jsonb). */
export type QuoteItem = { label: string; price: number; qty: number };

/** Quote with embedded client name and `items` narrowed to QuoteItem[]. */
export type QuoteWithClient = Omit<Quote, "items"> & {
  items: QuoteItem[];
  client: { name: string } | null;
};

/** One finding in a seo_check's `results` jsonb array. */
export type CheckStatus = "pass" | "warn" | "fail";
export type CheckResult = {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
  /** What the page actually has (e.g. the current title text) — for comparison with the example. */
  found?: string;
};

/** Project with its embedded client name (from the `client:clients(name)` select). */
export type ProjectWithClient = Project & { client: { name: string } | null };

/** Task with its embedded project title + that project's client name. */
export type TaskWithProject = Task & {
  project: { title: string; client: { name: string } | null } | null;
};

/** Invoice with embedded client name and `items` narrowed to QuoteItem[]. */
export type InvoiceWithClient = Omit<Invoice, "items"> & {
  items: QuoteItem[];
  client: { name: string } | null;
};

/** Seo check with embedded project title, and `results` narrowed to CheckResult[]. */
export type SeoCheckWithProject = Omit<SeoCheck, "results"> & {
  results: CheckResult[];
  project: { title: string } | null;
};
