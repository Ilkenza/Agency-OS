// Sanity check for the pure helpers. Run: node test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { igToLead, mapsToLead, toRpcArgs } = require("./format.js");

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

const ig = igToLead({ username: "zlatno_zrno", name: "Zlatno Zrno" });
eq("ig: channel", ig.channel, "instagram");
eq("ig: contact @username", ig.contact, "@zlatno_zrno");
eq("ig: name", ig.name, "Zlatno Zrno");
eq("ig: name falls back to username", igToLead({ username: "x", name: "" }).name, "x");
eq("ig: strips leading @", igToLead({ username: "@y" }).contact, "@y");

const noSite = mapsToLead({ name: "Pekara", phone: "+38160123", hasWebsite: false, link: "https://maps/x" });
eq("maps: channel google_maps", noSite.channel, "google_maps");
eq("maps: contact = phone", noSite.contact, "+38160123");
eq("maps: no site → service new_site", noSite.service, "new_site");
eq("maps: notes has link + nema sajt", noSite.notes, "https://maps/x · nema sajt");

const hasSite = mapsToLead({ name: "Cafe", phone: "", hasWebsite: true, link: "https://maps/y" });
eq("maps: has site → empty service", hasSite.service, "");
eq("maps: notes = link only", hasSite.notes, "https://maps/y");

const args = toRpcArgs({ name: "A", channel: "instagram", status: "new" }, "tok");
eq("rpc: token", args.p_token, "tok");
eq("rpc: name", args.p_name, "A");
eq("rpc: empty company → ''", args.p_company, "");
eq("rpc: status default", toRpcArgs({ name: "A" }, "t").p_status, "new");

console.log(failed ? `\n${failed} FAILED` : "\nAll passed.");
process.exit(failed ? 1 : 0);
