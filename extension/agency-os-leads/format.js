/* Pure transforms — no DOM, no chrome APIs. Loaded before popup.js in the
 * popup page (shared globals) and require()-able by test.mjs in node.
 *
 * Column order matches src/lib/leads/parse-import.ts. */

const HEADERS = [
  "name",
  "company",
  "contact",
  "channel",
  "service",
  "status",
  "value",
  "next_followup",
  "notes",
];

function mapsToRows(rows, onlyNoSite) {
  return rows
    .filter((r) => (onlyNoSite ? !r.hasWebsite : true))
    .map((r) => ({
      name: r.name,
      company: "",
      contact: r.phone || "",
      channel: r.phone ? "phone" : "",
      service: r.hasWebsite ? "" : "bez sajta",
      status: "new",
      value: "",
      next_followup: "",
      notes: [r.info, r.hasWebsite ? "" : "nema sajt"].filter(Boolean).join(" · "),
    }));
}

function instagramToRows(rows) {
  return rows.map((r) => ({
    name: r.name || r.username,
    company: "",
    contact: "@" + r.username,
    channel: "instagram",
    service: "",
    status: "new",
    value: "",
    next_followup: "",
    notes: "",
  }));
}

function toTSV(rows) {
  const head = HEADERS.join("\t");
  const body = rows.map((r) => HEADERS.map((h) => String(r[h] ?? "").replace(/\t/g, " ")).join("\t"));
  return [head, ...body].join("\n");
}

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function toCSV(rows) {
  const head = HEADERS.map(csvCell).join(",");
  const body = rows.map((r) => HEADERS.map((h) => csvCell(r[h])).join(","));
  return [head, ...body].join("\n");
}

if (typeof module !== "undefined") {
  module.exports = { HEADERS, mapsToRows, instagramToRows, toTSV, toCSV };
}
