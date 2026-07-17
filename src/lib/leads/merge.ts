import { serviceLabel } from "@/lib/status";

/** Lead fields available as `{variables}` in outreach templates. */
export type MergeLead = {
  name: string;
  company: string | null;
  contact: string | null;
  service: string | null;
};

/** Fill `{name}`, `{company}`, `{contact}`, `{service}` in a template body from a lead. */
export function renderTemplate(body: string, lead: MergeLead): string {
  const vars: Record<string, string> = {
    name: lead.name ?? "",
    company: lead.company ?? "",
    contact: lead.contact ?? "",
    service: serviceLabel(lead.service) ?? "",
  };
  // Unknown placeholders are left as-is so typos are visible.
  return body.replace(/\{(\w+)\}/g, (m, key: string) => {
    const k = key.toLowerCase();
    return k in vars ? vars[k] : m;
  });
}

/** The variables a user can put in a template (for the form hint). */
export const MERGE_VARS = ["{name}", "{company}", "{contact}", "{service}"];
