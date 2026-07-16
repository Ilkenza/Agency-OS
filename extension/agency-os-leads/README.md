# Agency OS — Lead Collector (Chrome ekstenzija)

Prikuplja leadove sa **Google Maps** i **Instagram**-a i izvozi ih u formatu koji tvoj Agency OS
`Leads → Import` odmah razume — **„Kopiraj za Agency OS"** (nalepiš) ili **„Preuzmi CSV"**.

## Instalacija

1. Otvori `chrome://extensions`
2. Uključi **Developer mode** (gore desno)
3. **Load unpacked** → izaberi ovaj folder (`extension/agency-os-leads`)
4. Zakači ikonu na traku (opciono)

## Korišćenje

### Google Maps (preporuka — lokalni biznisi bez sajta)
1. Otvori pretragu, npr. `pekare Novi Sad`, `frizeri Beograd`.
2. **Skroluj listu** dokle hoćeš da učitaš više rezultata.
3. Klikni ikonu → (opciono štikliraj **„Samo biznisi bez sajta"**) → **Prikupi**.
4. **Kopiraj za Agency OS** → u aplikaciji `Leads → Import` → nalepi (Ctrl+V) → pregled → Import.

Za Maps se automatski popunjava: `name`, `contact` (telefon ako je vidljiv), `service = bez sajta`
(kad nema sajt → u app-u postaje „Novi sajt"), `notes` (kategorija · adresa · „nema sajt").

### Instagram (beta)
1. Otvori listu **pratilaca / praćenih** (modal) ili rezultate pretrage.
2. **Prikupi** → **Kopiraj za Agency OS** → nalepi u Import.

Za IG: `name`, `contact = @username`, `channel = instagram`.

## Kolone (poklapaju se sa `src/lib/leads/parse-import.ts`)

`name, company, contact, channel, service, status, value, next_followup, notes` — obavezno je samo `name`.

## Ograničenja (pošteno)

- **Selektori se mogu pokvariti**: Google/Instagram menjaju svoj HTML. Ako „Prikupi" ne vrati ništa,
  treba doraditi selektore u `popup.js` (funkcije `scrapeMaps` / `scrapeInstagram`).
- **Telefon na Maps-u** često nije u listi (samo u detalju) — pokupi se samo ako je vidljiv u kartici.
- **Instagram** agresivno blokira automatizaciju — koristi umereno i mali obim; ovo samo čita ono što je
  već na ekranu (ne otvara profile, ne šalje ništa).
- Skupljaj **javne** podatke, u razumnoj količini; poštuj uslove korišćenja sajtova.

## Test (opciono)

Čiste funkcije za transformaciju/izvoz imaju sanity test:

```
node test.mjs
```

## Fajlovi

- `manifest.json` — MV3 manifest
- `popup.html` / `popup.css` — UI
- `format.js` — čiste funkcije (redovi → TSV/CSV); deljene sa popup-om i testom
- `popup.js` — detekcija sajta, ubacivanje scraper-a, dugmad
- `test.mjs` — node sanity test
