import { LEAD_STATUSES } from "@/lib/status";

const CHANNELS = ["email", "instagram", "linkedin", "whatsapp", "phone", "other"];

export type ImportRow = {
  name: string;
  company: string | null;
  contact: string | null;
  channel: string | null;
  status: string;
  value: number;
  notes: string | null;
  next_followup: string | null;
};

export type ParseResult = { rows: ImportRow[]; skipped: number; error?: string };

/** Split a single CSV/TSV line, honoring double-quoted fields. */
function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * Parse pasted spreadsheet data (tab-separated) or CSV into lead rows.
 * Requires a header row; only `name` is mandatory. Unknown status/channel
 * fall back to sensible defaults so a messy sheet still imports.
 */
export function parseLeadsImport(text: string): ParseResult {
  const clean = text.replace(/\r\n?/g, "\n").trim();
  if (!clean) return { rows: [], skipped: 0, error: "Nothing to import." };

  const lines = clean.split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 2) {
    return { rows: [], skipped: 0, error: "Add a header row and at least one lead below it." };
  }

  const delim = lines[0].includes("\t") ? "\t" : ",";
  const headers = splitLine(lines[0], delim).map((h) => h.toLowerCase().replace(/\s+/g, "_"));

  const idx = (names: string[]) => {
    for (const n of names) {
      const i = headers.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iName = idx(["name", "ime", "naziv", "lead"]);
  const iCompany = idx(["company", "firma", "kompanija"]);
  const iContact = idx(["contact", "kontakt", "email", "e-mail", "phone", "telefon"]);
  const iChannel = idx(["channel", "kanal"]);
  const iStatus = idx(["status"]);
  const iValue = idx(["value", "vrednost", "iznos"]);
  const iFollow = idx(["next_followup", "followup", "follow_up", "rok"]);
  const iNotes = idx(["notes", "beleske", "napomena", "note"]);

  if (iName < 0) {
    return { rows: [], skipped: 0, error: "The header must include a 'name' column." };
  }

  const rows: ImportRow[] = [];
  let skipped = 0;

  for (let r = 1; r < lines.length; r++) {
    const cells = splitLine(lines[r], delim);
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");

    const name = get(iName);
    if (!name) {
      skipped++;
      continue;
    }

    const channelRaw = get(iChannel).toLowerCase();
    const channel = CHANNELS.includes(channelRaw) ? channelRaw : null;

    const statusRaw = get(iStatus).toLowerCase().replace(/\s+/g, "_");
    const status = (LEAD_STATUSES as readonly string[]).includes(statusRaw) ? statusRaw : "new";

    const valNum = Number(
      get(iValue)
        .replace(/[^\d.,-]/g, "")
        .replace(",", "."),
    );
    const value = Number.isFinite(valNum) && valNum > 0 ? valNum : 0;

    const follow = get(iFollow);
    const next_followup = /^\d{4}-\d{2}-\d{2}$/.test(follow) ? follow : null;

    rows.push({
      name,
      company: get(iCompany) || null,
      contact: get(iContact) || null,
      channel,
      status,
      value,
      notes: get(iNotes) || null,
      next_followup,
    });
  }

  return { rows, skipped };
}
