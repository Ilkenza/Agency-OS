// Quick sanity check for the pure transforms. Run: node test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { HEADERS, mapsToRows, instagramToRows, toTSV, toCSV } = require("./format.js");

let failed = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    failed++;
    console.error(`✗ ${label}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`);
  } else {
    console.log(`✓ ${label}`);
  }
};

const maps = mapsToRows(
  [
    { name: "Pekara Zlatno Zrno", phone: "060 123 4567", hasWebsite: false, info: "Pekara · Novi Sad" },
    { name: "Cafe Aroma", phone: "", hasWebsite: true, info: "Kafić · Beograd" },
  ],
  false,
);
eq("maps: count", maps.length, 2);
eq("maps: no-site → service 'bez sajta'", maps[0].service, "bez sajta");
eq("maps: no-site → notes has 'nema sajt'", maps[0].notes, "Pekara · Novi Sad · nema sajt");
eq("maps: phone → channel phone", maps[0].channel, "phone");
eq("maps: has-site → empty service", maps[1].service, "");

const onlyNoSite = mapsToRows(
  [
    { name: "A", phone: "", hasWebsite: false, info: "x" },
    { name: "B", phone: "", hasWebsite: true, info: "y" },
  ],
  true,
);
eq("maps: onlyNoSite filters", onlyNoSite.length, 1);
eq("maps: onlyNoSite keeps the no-site one", onlyNoSite[0].name, "A");

const ig = instagramToRows([{ username: "zlatno_zrno", name: "Zlatno Zrno" }, { username: "x", name: "" }]);
eq("ig: channel instagram", ig[0].channel, "instagram");
eq("ig: contact @username", ig[0].contact, "@zlatno_zrno");
eq("ig: name falls back to username", ig[1].name, "x");

const tsv = toTSV(maps);
eq("tsv: header line", tsv.split("\n")[0], HEADERS.join("\t"));
eq("tsv: row count", tsv.split("\n").length, 3);

const csv = toCSV([{ name: 'A, "B"', notes: "c\nd" }]);
eq("csv: quotes/commas escaped", csv.split("\n")[1].startsWith('"A, ""B"""'), true);

console.log(failed ? `\n${failed} FAILED` : "\nAll passed.");
process.exit(failed ? 1 : 0);
