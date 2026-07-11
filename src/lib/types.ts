import type { Tables } from "./database.types";

export type Client = Tables<"clients">;
export type Project = Tables<"projects">;
export type Task = Tables<"tasks">;
export type Invoice = Tables<"invoices">;
export type SeoCheck = Tables<"seo_checks">;
export type Lead = Tables<"leads">;
export type OutreachTemplate = Tables<"outreach_templates">;

/** One finding in a seo_check's `results` jsonb array. */
export type CheckStatus = "pass" | "warn" | "fail";
export type CheckResult = { key: string; label: string; status: CheckStatus; detail: string };

/** Project with its embedded client name (from the `client:clients(name)` select). */
export type ProjectWithClient = Project & { client: { name: string } | null };

/** Task with its embedded project title (from the `project:projects(title)` select). */
export type TaskWithProject = Task & { project: { title: string } | null };

/** Invoice with its embedded client name (from the `client:clients(name)` select). */
export type InvoiceWithClient = Invoice & { client: { name: string } | null };

/** Seo check with embedded project title, and `results` narrowed to CheckResult[]. */
export type SeoCheckWithProject = Omit<SeoCheck, "results"> & {
  results: CheckResult[];
  project: { title: string } | null;
};
