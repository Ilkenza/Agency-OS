/* Agency OS — Lead Collector popup.
 *
 * Flow: load config → detect Instagram profile / Google Maps place → scrape the
 * open item → check if the lead already exists → let the user edit → save via
 * Supabase RPC (ext_add_lead). Pure helpers live in format.js.
 */

const els = {
  notice: document.getElementById("notice"),
  main: document.getElementById("main"),
  exists: document.getElementById("exists"),
  form: document.getElementById("form"),
  channel: document.getElementById("channel"),
  save: document.getElementById("save"),
  msg: document.getElementById("msg"),
};

let cfg = null;
let mode = null; // "instagram" | "maps"

function notice(html) {
  els.notice.innerHTML = html;
  els.notice.classList.remove("hidden");
  els.main.classList.add("hidden");
}
function setMsg(text, cls, ms) {
  els.msg.textContent = text;
  els.msg.className = "msg " + (cls || "");
  if (ms) setTimeout(() => (els.msg.textContent = ""), ms);
}

// ---------- Scrapers (run in the page) ----------

function scrapeIgProfile() {
  const m = location.pathname.match(/^\/([A-Za-z0-9._]+)\/?$/);
  const reserved = ["explore", "reels", "direct", "accounts", "p", "stories", "about"];
  if (!m || reserved.includes(m[1]))
    return { error: "Otvori nečiju Instagram stranicu profila (npr. instagram.com/ime)." };
  const username = m[1];
  let name = "";
  const header = document.querySelector("header");
  if (header) {
    const texts = [...header.querySelectorAll("h1, h2, span")]
      .map((e) => e.textContent.trim())
      .filter((t) => t && t.length < 60 && t.toLowerCase() !== username.toLowerCase());
    name = texts.find((t) => !/^\d|følg|follow|prati|posts|objav/i.test(t)) || "";
  }
  return { source: "instagram", username, name };
}

function scrapeMapsPlace() {
  const name = (document.querySelector("h1")?.textContent || "").trim();
  if (!name) return { error: "Otvori biznis na Google Maps (klikni na mesto da se otvori panel)." };
  let phone = "";
  const pb = document.querySelector('button[data-item-id^="phone:tel:"]');
  if (pb) {
    const id = pb.getAttribute("data-item-id") || "";
    phone = id.split("tel:")[1] || (pb.getAttribute("aria-label") || "").replace(/^[^:]*:/, "").trim();
  }
  const hasWebsite = !!document.querySelector('a[data-item-id="authority"]');
  return { source: "maps", name, phone, hasWebsite, link: location.href };
}

// ---------- Supabase RPC ----------

async function rpc(fn, args) {
  const res = await fetch(`${cfg.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: cfg.anonKey,
      Authorization: "Bearer " + cfg.anonKey,
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

/** Look up the existing lead; if found, mark ✓ and fill the form from it. */
async function syncExisting(contact, name) {
  els.exists.className = "exists";
  els.exists.innerHTML = "Proveravam…";
  try {
    const found = await rpc("ext_get_lead", {
      p_token: cfg.token,
      p_contact: contact || "",
      p_name: name || "",
    });
    if (found) {
      // Keep the auto channel if the stored one is empty.
      fillForm({ ...found, channel: found.channel || els.form.channel.value });
      els.exists.className = "exists dupe";
      els.exists.innerHTML = '<span class="mark">✓</span> Već postoji u Agency OS';
    } else {
      els.exists.className = "exists new";
      els.exists.innerHTML = '<span class="mark">✗</span> Nov lead';
    }
  } catch (e) {
    els.exists.className = "exists";
    els.exists.innerHTML = "Ne mogu da proverim (proveri vezu u Options).";
    setMsg(String(e.message || e), "err", 8000);
  }
}

function fillForm(lead) {
  els.form.name.value = lead.name || "";
  els.form.company.value = lead.company || "";
  els.form.contact.value = lead.contact || "";
  els.form.channel.value = lead.channel || "";
  els.form.service.value = lead.service || "";
  els.form.status.value = lead.status || "new";
  els.form.notes.value = lead.notes || "";
}

// ---------- Boot ----------

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// --- Draft: keep unsaved edits per page across popup close/reopen ---
let draftKey = null;

function currentForm() {
  return {
    name: els.form.name.value,
    company: els.form.company.value,
    contact: els.form.contact.value,
    channel: els.form.channel.value,
    service: els.form.service.value,
    status: els.form.status.value,
    notes: els.form.notes.value,
  };
}

async function saveDraft() {
  if (!draftKey) return;
  const s = await chrome.storage.local.get(["drafts"]);
  const drafts = s.drafts || {};
  drafts[draftKey] = currentForm();
  chrome.storage.local.set({ drafts });
}

async function applyDraft() {
  if (!draftKey) return;
  const s = await chrome.storage.local.get(["drafts"]);
  const d = (s.drafts || {})[draftKey];
  if (d) fillForm(d);
}

async function clearDraft() {
  if (!draftKey) return;
  const s = await chrome.storage.local.get(["drafts"]);
  const drafts = s.drafts || {};
  delete drafts[draftKey];
  chrome.storage.local.set({ drafts });
}

async function boot() {
  const store = await chrome.storage.sync.get(["agencyos"]);
  cfg = store.agencyos;
  if (!cfg || !cfg.url || !cfg.token) {
    notice(
      'Nije povezano. Otvori <b>Options</b> ekstenzije i nalepi config iz aplikacije (Settings → Browser extension).',
    );
    return;
  }

  const tab = await activeTab();
  const url = tab?.url || "";
  draftKey = url;
  if (/^https:\/\/www\.instagram\.com\//.test(url)) mode = "instagram";
  else if (/^https:\/\/www\.google\.[^/]+\/maps/.test(url)) mode = "maps";
  else {
    notice("Otvori nečiji <b>Instagram profil</b> ili <b>biznis na Google Maps</b>.");
    return;
  }

  let data;
  try {
    const fn = mode === "instagram" ? scrapeIgProfile : scrapeMapsPlace;
    const [r] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: fn });
    data = r?.result;
  } catch (e) {
    notice("Ne mogu da pročitam stranicu: " + (e?.message || e));
    return;
  }
  if (!data || data.error) {
    notice(data?.error || "Ništa nije pronađeno na stranici.");
    return;
  }

  els.notice.classList.add("hidden");
  els.main.classList.remove("hidden");

  const lead = mode === "instagram" ? igToLead(data) : mapsToLead(data);
  fillForm(lead);
  // 1) saved lead from DB overrides scraped defaults; 2) unsaved draft wins over both.
  await syncExisting(lead.contact, lead.name);
  await applyDraft();

  // Persist every edit so closing the popup doesn't lose unsaved input.
  els.form.addEventListener("input", saveDraft);
}

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.save.disabled = true;
  setMsg("Čuvam…");
  try {
    const lead = {
      name: els.form.name.value.trim(),
      company: els.form.company.value.trim(),
      contact: els.form.contact.value.trim(),
      channel: els.form.channel.value.trim(),
      service: els.form.service.value,
      status: els.form.status.value,
      notes: els.form.notes.value.trim(),
    };
    await rpc("ext_add_lead", toRpcArgs(lead, cfg.token));
    setMsg("Sačuvano u Agency OS ✓", "ok", 5000);
    await clearDraft(); // saved → drop the unsaved-draft copy
    syncExisting(lead.contact, lead.name);
  } catch (e2) {
    setMsg("Greška: " + (e2?.message || e2), "err", 9000);
  }
  els.save.disabled = false;
});

boot();
