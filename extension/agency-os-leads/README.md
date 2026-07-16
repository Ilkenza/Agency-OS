# Agency OS — Lead Collector (Chrome ekstenzija)

Otvoriš **jedan** Instagram profil, Facebook stranicu ili Google Maps biznis → ekstenzija uzme podatke sa te stranice,
**proveri da li lead već postoji** u Agency OS (✓ / ✗), pustiš te da dopuniš polja i **sačuvaš direktno
u bazu**. Bez CSV-a i bez ručnog kucanja.

## Jednokratni setup

1. U aplikaciji: **Settings → Browser extension** → **Generiši token** → **Kopiraj config za ekstenziju**.
2. `chrome://extensions` → **Developer mode** → **Load unpacked** → izaberi folder `extension/agency-os-leads`.
3. Desni klik na ikonu ekstenzije → **Options** → nalepi config → **Sačuvaj vezu** (piše „Povezano ✓").

Config je JSON `{ url, anonKey, token }`. `url`/`anonKey` su javni (Supabase), `token` je tvoja tajna
koja povezuje ekstenziju sa tvojim nalogom.

## Korišćenje

- **Instagram**: otvori nečiji profil (`instagram.com/ime`) → klikni ikonu. Popup pokaže ✓/✗ i formu
  (name, contact `@username`, channel `instagram`, + service/status/notes/company po izboru) → **Sačuvaj**.
- **Facebook**: otvori stranicu/profil (`facebook.com/ime`) → klikni ikonu. Uzme naziv (h1) i link;
  channel = `facebook`.
- **Google Maps**: klikni na biznis da se otvori panel → klikni ikonu. Uzme naziv, telefon (ako postoji),
  DA/NE ima sajt, i **link** (ide u notes); channel = `google_maps` → dopuni → **Sačuvaj**.

Lead se odmah pojavi u aplikaciji pod **Leads**.

## Ograničenja / bezbednost

- **Token je tajna** — ko ga ima može dodavati leadove tebi. Čuvaj ga; **Regeneriši token** u Settings
  odmah opoziva stari.
- **Selektori se mogu pokvariti**: Instagram/Google menjaju HTML. Ako popup kaže da ništa nije pronašao,
  treba doraditi `scrapeIgProfile` / `scrapeMapsPlace` u `popup.js`.
- **Telefon** na Maps-u se čita samo ako je prikazan u panelu.
- Ekstenzija samo **čita** otvorenu stranicu i **piše u tvoj Agency OS** — ništa ne šalje na IG/Google.

## Test

```
node test.mjs
```

## Fajlovi

- `manifest.json` — MV3 manifest (+ options_page)
- `popup.html` / `popup.css` — UI (forma + provera duplikata)
- `popup.js` — detekcija sajta, scraper injekcija, provera i upis (Supabase RPC)
- `format.js` — čiste funkcije (scrape → lead payload); deljene sa testom
- `options.html` / `options.js` — unos/čuvanje config-a
- `test.mjs` — node sanity test
