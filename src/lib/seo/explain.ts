/** Per-check help: why it matters + a concrete good example. Shown in expandable findings. */
export type CheckInfo = { why: string; example?: string };

export const CHECK_INFO: Record<string, CheckInfo> = {
  title: {
    why: "Naslov (<title>) je plavi link u Google rezultatima i ime stranice za AI. Idealno 30–60 znakova, sa ključnom rečju.",
    example: "<title>Pekara Zlatno Zrno — Sveže pecivo i hleb u Novom Sadu</title>",
  },
  description: {
    why: "Meta opis je tekst ispod linka u pretrazi; dobar opis podiže broj klikova. 70–160 znakova.",
    example:
      '<meta name="description" content="Domaća pekara u Novom Sadu — sveže pecivo, hleb i kolači svakog jutra. Poručite online ili svratite.">',
  },
  h1: {
    why: "H1 je glavni naslov stranice. Tačno jedan H1 jasno govori i Google-u i AI-ju o čemu je stranica.",
    example: "<h1>Sveže pecivo iz naše pekare</h1>",
  },
  headings: {
    why: "H2 sekcije dele sadržaj na celine — lakše za čitanje i za AI da izvuče tačan odgovor.",
    example: "<h2>Naša ponuda</h2> · <h2>Radno vreme</h2> · <h2>Kontakt</h2>",
  },
  words: {
    why: "Dovoljno teksta (300+ reči) daje kontekst pretraživaču i AI-ju. Premalo sadržaja = slabo rangiranje.",
    example: "Opis usluga, o nama, česta pitanja — realan tekst, ne samo slike.",
  },
  canonical: {
    why: "Canonical link sprečava da se ista stranica broji kao duplikat i deli SEO snagu.",
    example: '<link rel="canonical" href="https://tvojsajt.rs/usluge">',
  },
  viewport: {
    why: "Viewport meta znači da je sajt prilagođen mobilnom. Google prvo gleda mobilnu verziju.",
    example: '<meta name="viewport" content="width=device-width, initial-scale=1">',
  },
  lang: {
    why: "Atribut lang govori kom jeziku pripada stranica — bitno za lokalne (srpske) rezultate.",
    example: '<html lang="sr">',
  },
  alt: {
    why: "Alt tekst opisuje slike — za pristupačnost, Google Slike i AI koji ne vidi sliku.",
    example: '<img src="pecivo.jpg" alt="Sveži kroasani na pladnju">',
  },
  jsonld: {
    why: "JSON-LD (schema.org) su strukturirani podaci koje AI motori (ChatGPT, Gemini) i Google direktno čitaju — ključno za GEO.",
    example:
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Bakery","name":"Zlatno Zrno","address":"Novi Sad"}</script>',
  },
  og: {
    why: "Open Graph tagovi kontrolišu kako izgleda link kada se deli (naslov, opis, slika) na mrežama i u AI pregledima.",
    example: '<meta property="og:title" content="Pekara Zlatno Zrno"> + og:description + og:image',
  },
};
