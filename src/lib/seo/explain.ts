/** Per-check help: why it matters + a concrete good example. Shown in expandable findings. */
export type CheckInfo = { why: string; example?: string };

export const CHECK_INFO: Record<string, CheckInfo> = {
  title: {
    why: "The <title> is the blue link in Google results and the page's name for AI. Aim for 30–60 characters with your keyword.",
    example: "<title>Zlatno Zrno Bakery — Fresh bread & pastries in Novi Sad</title>",
  },
  description: {
    why: "The meta description is the text under the link in search; a good one lifts click-through. 70–160 characters.",
    example:
      '<meta name="description" content="Local bakery in Novi Sad — fresh pastries, bread and cakes every morning. Order online or drop by.">',
  },
  h1: {
    why: "The H1 is the page's main heading. Exactly one H1 tells Google and AI clearly what the page is about.",
    example: "<h1>Fresh pastries from our bakery</h1>",
  },
  headings: {
    why: "H2 sections split content into parts — easier to read and for AI to extract the right answer.",
    example: "<h2>Our menu</h2> · <h2>Opening hours</h2> · <h2>Contact</h2>",
  },
  words: {
    why: "Enough text (300+ words) gives search engines and AI context. Too little content ranks poorly.",
    example: "Service descriptions, about us, FAQs — real text, not just images.",
  },
  canonical: {
    why: "A canonical link stops the same page counting as a duplicate and splitting its SEO strength.",
    example: '<link rel="canonical" href="https://yoursite.com/services">',
  },
  viewport: {
    why: "The viewport meta means the site is mobile-friendly. Google looks at the mobile version first.",
    example: '<meta name="viewport" content="width=device-width, initial-scale=1">',
  },
  lang: {
    why: "The lang attribute tells search engines the page's language — important for local results.",
    example: '<html lang="en">',
  },
  alt: {
    why: "Alt text describes images — for accessibility, Google Images, and AI that can't see the image.",
    example: '<img src="pastries.jpg" alt="Fresh croissants on a tray">',
  },
  jsonld: {
    why: "JSON-LD (schema.org) is structured data that AI engines (ChatGPT, Gemini) and Google read directly — key for GEO.",
    example:
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Bakery","name":"Zlatno Zrno","address":"Novi Sad"}</script>',
  },
  og: {
    why: "Open Graph tags control how a link looks when shared (title, description, image) on social and in AI previews.",
    example: '<meta property="og:title" content="Zlatno Zrno Bakery"> + og:description + og:image',
  },
};
