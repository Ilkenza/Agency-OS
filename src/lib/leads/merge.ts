import { serviceLabel } from "@/lib/status";

export type MergeLead = {
  name: string;
  company: string | null;
  contact: string | null;
  service: string | null;
};

export function renderTemplate(body: string, lead: MergeLead): string {
  const vars: Record<string, string> = {
    name: lead.name ?? "",
    company: lead.company ?? "",
    contact: lead.contact ?? "",
    service: serviceLabel(lead.service) ?? "",
  };
  return body.replace(/\{(\w+)\}/g, (m, key: string) => {
    const k = key.toLowerCase();
    return k in vars ? vars[k] : m;
  });
}

export const MERGE_VARS = ["{name}", "{company}", "{contact}", "{service}"];
