/* Agency OS — Lead Collector popup logic.
 *
 * Flow: detect site → inject the matching scraper into the active tab →
 * turn raw results into Agency-OS import rows → Copy (TSV) / Download (CSV).
 *
 * Pure transforms (HEADERS, mapsToRows, instagramToRows, toTSV, toCSV) live in
 * format.js, loaded before this file.
 */

// ============================================================
// Scrapers — these run IN THE PAGE (no access to popup scope).
// Keep them self-contained. Selectors may need updating if the
// site changes its markup (see README).
// ============================================================

function scrapeMaps() {
  const feed = document.querySelector('div[role="feed"]');
  if (!feed) return { error: "Nisam našao listu rezultata. Otvori Google Maps pretragu." };

  const out = [];
  const cards = feed.querySelectorAll("a.hfpxzc");
  cards.forEach((link) => {
    const name = (link.getAttribute("aria-label") || "").trim();
    if (!name) return;
    // The clickable card wrapper holds the info text + action buttons.
    const card = link.closest('div[jsaction]') || link.parentElement;
    const text = card ? card.innerText : "";
    const hasWebsite = !!(
      card &&
      (card.querySelector('a[data-value="Website"]') ||
        card.querySelector('a[aria-label^="Visit"]') ||
        card.querySelector('a[aria-label*="sajt" i]'))
    );
    const phoneMatch = text.match(/(\+?\d[\d\s\/().-]{6,}\d)/);
    const phone = phoneMatch ? phoneMatch[1].replace(/\s{2,}/g, " ").trim() : "";
    // First couple of info lines usually = category · address.
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s !== name);
    const info = lines.slice(0, 2).join(" · ");
    out.push({ name, phone, hasWebsite, info, url: link.href || "" });
  });

  // Dedupe by name+info.
  const seen = new Set();
  const rows = out.filter((r) => {
    const k = (r.name + "|" + r.info).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { source: "maps", rows };
}

function scrapeInstagram() {
  // Prefer a followers/following dialog; fall back to any list of profile links.
  const scope = document.querySelector('div[role="dialog"]') || document.body;
  const anchors = scope.querySelectorAll('a[href^="/"]');
  const out = [];
  const seen = new Set();
  anchors.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const m = href.match(/^\/([A-Za-z0-9._]+)\/?$/);
    if (!m) return;
    const username = m[1];
    const reserved = ["explore", "reels", "direct", "accounts", "p", "stories", "about"];
    if (reserved.includes(username)) return;
    if (seen.has(username)) return;
    seen.add(username);
    // Full name: nearest row often has a second span with the display name.
    let name = "";
    const row = a.closest("div");
    if (row) {
      const spans = [...row.querySelectorAll("span")]
        .map((s) => s.textContent.trim())
        .filter((t) => t && t.toLowerCase() !== username.toLowerCase() && t.length < 60);
      if (spans[0]) name = spans[0];
    }
    out.push({ username, name });
  });
  if (out.length === 0)
    return { error: "Nisam našao naloge. Otvori listu pratilaca/praćenih ili rezultate pretrage." };
  return { source: "instagram", rows: out };
}

// ============================================================
// UI wiring
// ============================================================

const els = {
  source: document.getElementById("source"),
  onlyNoSiteWrap: document.getElementById("onlyNoSiteWrap"),
  onlyNoSite: document.getElementById("onlyNoSite"),
  collect: document.getElementById("collect"),
  count: document.getElementById("count"),
  preview: document.getElementById("preview"),
  copy: document.getElementById("copy"),
  csv: document.getElementById("csv"),
  msg: document.getElementById("msg"),
};

let mode = null; // "maps" | "instagram"
let currentRows = []; // Agency-OS shaped rows

function setMsg(text, ms) {
  els.msg.textContent = text;
  if (ms) setTimeout(() => (els.msg.textContent = ""), ms);
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function detect() {
  const tab = await activeTab();
  const url = tab?.url || "";
  if (/^https:\/\/www\.google\.[^/]+\/maps/.test(url)) {
    mode = "maps";
    els.source.innerHTML = "Izvor: <b>Google Maps</b>";
    els.onlyNoSiteWrap.classList.remove("hidden");
    els.collect.disabled = false;
  } else if (/^https:\/\/www\.instagram\.com/.test(url)) {
    mode = "instagram";
    els.source.innerHTML = "Izvor: <b>Instagram</b> (beta)";
    els.collect.disabled = false;
  } else {
    mode = null;
    els.source.innerHTML = "Otvori <b>Google Maps</b> ili <b>Instagram</b> pa klikni ikonu.";
    els.collect.disabled = true;
  }
}

function renderPreview(rows) {
  if (rows.length === 0) {
    els.preview.classList.remove("show");
    els.preview.innerHTML = "";
    return;
  }
  const cols = ["name", "contact", "channel", "service", "notes"];
  const head = cols.map((c) => `<th>${c}</th>`).join("");
  const body = rows
    .slice(0, 10)
    .map((r) => "<tr>" + cols.map((c) => `<td>${escapeHtml(r[c] || "")}</td>`).join("") + "</tr>")
    .join("");
  els.preview.innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  els.preview.classList.add("show");
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

async function collect() {
  setMsg("Prikupljam…");
  els.collect.disabled = true;
  try {
    const tab = await activeTab();
    const fn = mode === "maps" ? scrapeMaps : scrapeInstagram;
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: fn });
    const data = res?.result;
    if (!data || data.error) {
      setMsg(data?.error || "Ništa nije prikupljeno.", 6000);
      currentRows = [];
    } else if (data.source === "maps") {
      currentRows = mapsToRows(data.rows, els.onlyNoSite.checked);
      setMsg("");
    } else {
      currentRows = instagramToRows(data.rows);
      setMsg("");
    }
  } catch (e) {
    setMsg("Greška: " + (e?.message || e), 8000);
    currentRows = [];
  }

  els.count.textContent = currentRows.length ? `Prikupljeno: ${currentRows.length}` : "";
  renderPreview(currentRows);
  const has = currentRows.length > 0;
  els.copy.disabled = !has;
  els.csv.disabled = !has;
  els.collect.disabled = false;
}

async function copyOut() {
  try {
    await navigator.clipboard.writeText(toTSV(currentRows));
    setMsg("Kopirano! Nalepi u Agency OS → Leads → Import.", 5000);
  } catch (e) {
    setMsg("Kopiranje nije uspelo: " + (e?.message || e), 6000);
  }
}

function downloadCsv() {
  const blob = new Blob(["﻿" + toCSV(currentRows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  chrome.downloads.download(
    { url, filename: `agency-os-leads-${mode}-${stamp}.csv`, saveAs: true },
    () => setTimeout(() => URL.revokeObjectURL(url), 4000),
  );
}

els.collect.addEventListener("click", collect);
els.copy.addEventListener("click", copyOut);
els.csv.addEventListener("click", downloadCsv);
els.onlyNoSite.addEventListener("change", () => {
  // Re-collect is cheap; just re-run if we already have data.
  if (currentRows.length) collect();
});

detect();
