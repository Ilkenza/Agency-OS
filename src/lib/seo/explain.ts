/** Plain-language "why it matters" per check key — shown under each SEO/GEO finding. */
export const CHECK_WHY: Record<string, string> = {
  title:
    "Naslov (<title>) je ono što Google prikazuje kao plavi link i što AI koristi kao ime stranice. 30–60 znakova.",
  description:
    "Meta opis je tekst ispod linka u rezultatima pretrage. Dobar opis podiže broj klikova. 70–160 znakova.",
  h1: "H1 je glavni naslov stranice. Tačno jedan H1 jasno govori pretraživaču i AI-ju o čemu je stranica.",
  headings:
    "H2 sekcije dele sadržaj na celine — lakše za čitanje i za AI da izvuče tačan odgovor.",
  words:
    "Dovoljno teksta (300+ reči) daje pretraživaču i AI-ju kontekst. Premalo sadržaja = slabo rangiranje.",
  canonical:
    "Canonical link sprečava da se ista stranica broji više puta (duplikati) i deli SEO snagu.",
  viewport:
    "Viewport meta znači da je sajt prilagođen mobilnom. Google prvo gleda mobilnu verziju.",
  lang: "Atribut lang (npr. sr, en) govori kom jeziku pripada stranica — bitno za lokalne rezultate.",
  alt: "Alt tekst opisuje slike — za pristupačnost, Google Slike i AI koji ne 'vidi' sliku.",
  jsonld:
    "JSON-LD (schema.org) su strukturirani podaci koje AI motori (ChatGPT, Gemini) i Google direktno čitaju — ključno za GEO.",
  og: "Open Graph tagovi kontrolišu kako izgleda link kada se deli (naslov, opis, slika) na mrežama i u AI pregledima.",
};
