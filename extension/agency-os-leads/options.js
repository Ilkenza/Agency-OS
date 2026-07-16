/* Store the Agency OS connection ({url, anonKey, token}) in chrome.storage.sync. */

const cfgEl = document.getElementById("cfg");
const statusEl = document.getElementById("status");

function show(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "");
}

chrome.storage.sync.get(["agencyos"], (res) => {
  if (res.agencyos) {
    cfgEl.value = JSON.stringify(res.agencyos, null, 2);
    show("Povezano ✓", "ok");
  }
});

document.getElementById("save").addEventListener("click", () => {
  let cfg;
  try {
    cfg = JSON.parse(cfgEl.value);
  } catch {
    return show("Nevažeći JSON — kopiraj config iz aplikacije.", "err");
  }
  if (!cfg || !cfg.url || !cfg.anonKey || !cfg.token) {
    return show("Config mora imati url, anonKey i token.", "err");
  }
  cfg.url = String(cfg.url).replace(/\/+$/, "");
  chrome.storage.sync.set({ agencyos: cfg }, () => show("Sačuvano i povezano ✓", "ok"));
});
