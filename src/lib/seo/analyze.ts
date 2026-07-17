import * as cheerio from "cheerio";
import type { CheckResult, CheckStatus } from "@/lib/types";

export type AnalyzeResult = { title: string | null; score: number; results: CheckResult[] };

/** Parse HTML and score on-page SEO + GEO (generative-readiness) signals. Pure/testable. */
export function analyzeHtml(html: string): AnalyzeResult {
  const $ = cheerio.load(html);
  const results: CheckResult[] = [];
  const push = (
    key: string,
    label: string,
    status: CheckStatus,
    detail: string,
    found?: string,
  ) => results.push({ key, label, status, detail, found });

  // --- SEO ---
  const title = $("title").first().text().trim();
  const titleLen = title.length;
  if (!title) push("title", "Title tag", "fail", "No <title> found.");
  else if (titleLen >= 30 && titleLen <= 60)
    push("title", "Title tag", "pass", `${titleLen} chars — good length.`, title);
  else push("title", "Title tag", "warn", `${titleLen} chars — aim for 30–60.`, title);

  const desc = ($('meta[name="description"]').attr("content") ?? "").trim();
  const descLen = desc.length;
  if (!desc) push("description", "Meta description", "fail", "Missing meta description.");
  else if (descLen >= 70 && descLen <= 160)
    push("description", "Meta description", "pass", `${descLen} chars — good length.`, desc);
  else push("description", "Meta description", "warn", `${descLen} chars — aim for 70–160.`, desc);

  const h1s = $("h1").length;
  if (h1s === 1) push("h1", "Single H1", "pass", "Exactly one H1.");
  else if (h1s === 0) push("h1", "Single H1", "fail", "No H1 heading found.");
  else push("h1", "Single H1", "warn", `${h1s} H1 tags — use one.`);

  const h2s = $("h2").length;
  if (h2s >= 1)
    push("headings", "Heading structure", "pass", `${h2s} H2 section(s) — good structure.`);
  else
    push(
      "headings",
      "Heading structure",
      "warn",
      "No H2s — add sections for readability & AI extraction.",
    );

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const words = bodyText ? bodyText.split(" ").length : 0;
  if (words >= 300) push("words", "Content length", "pass", `${words} words.`);
  else if (words >= 100) push("words", "Content length", "warn", `${words} words — thin content.`);
  else push("words", "Content length", "fail", `${words} words — very thin.`);

  const canonical = $('link[rel="canonical"]').attr("href");
  push(
    "canonical",
    "Canonical URL",
    canonical ? "pass" : "warn",
    canonical ? "Canonical set." : "No canonical link.",
    canonical || undefined,
  );

  const viewport = $('meta[name="viewport"]').attr("content");
  push(
    "viewport",
    "Mobile viewport",
    viewport ? "pass" : "fail",
    viewport ? "Viewport meta set." : "No viewport meta — not mobile-friendly.",
    viewport || undefined,
  );

  const lang = $("html").attr("lang");
  push(
    "lang",
    "HTML lang",
    lang ? "pass" : "warn",
    lang ? `lang="${lang}".` : "No <html lang> attribute.",
    lang ? `lang="${lang}"` : undefined,
  );

  const imgs = $("img");
  if (imgs.length === 0) push("alt", "Image alt text", "pass", "No images on the page.");
  else {
    let withAlt = 0;
    imgs.each((_, el) => {
      const a = $(el).attr("alt");
      if (a !== undefined && a.trim() !== "") withAlt++;
    });
    const pctAlt = Math.round((withAlt / imgs.length) * 100);
    if (pctAlt >= 80)
      push("alt", "Image alt text", "pass", `${pctAlt}% of ${imgs.length} images have alt.`);
    else if (pctAlt > 0)
      push("alt", "Image alt text", "warn", `${pctAlt}% of ${imgs.length} images have alt.`);
    else push("alt", "Image alt text", "fail", "No images have alt text.");
  }

  // --- GEO / generative-readiness ---
  const ld = $('script[type="application/ld+json"]').length;
  push(
    "jsonld",
    "Structured data (JSON-LD)",
    ld ? "pass" : "warn",
    ld
      ? `${ld} JSON-LD block(s) — helps AI engines understand the page.`
      : "No JSON-LD — add schema.org for AI/GEO visibility.",
  );

  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogFound = [ogTitle && `og:title="${ogTitle}"`, ogDesc && `og:description="${ogDesc}"`]
    .filter(Boolean)
    .join(" · ");
  if (ogTitle && ogDesc)
    push("og", "Open Graph", "pass", "og:title and og:description set.", ogFound);
  else if (ogTitle || ogDesc) push("og", "Open Graph", "warn", "Partial Open Graph tags.", ogFound);
  else push("og", "Open Graph", "warn", "No Open Graph tags — worse link/AI previews.");

  const weight = (s: CheckStatus) => (s === "pass" ? 1 : s === "warn" ? 0.5 : 0);
  const score = results.length
    ? Math.round((results.reduce((a, r) => a + weight(r.status), 0) / results.length) * 100)
    : 0;

  return { title: title || null, score, results };
}

export type FetchResult =
  | { ok: true; url: string; data: AnalyzeResult }
  | { ok: false; error: string };

/** Fetch a URL server-side (with timeout + UA) and analyze it. */
export async function fetchAndAnalyze(rawUrl: string): Promise<FetchResult> {
  let url = rawUrl.trim();
  if (!url) return { ok: false, error: "Enter a URL." };
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "Enter a valid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http/https URLs are supported." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AgencyOS-SEO/1.0)" },
    });
    if (!res.ok) return { ok: false, error: `Site returned HTTP ${res.status}.` };
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return { ok: false, error: "URL did not return an HTML page." };
    }
    let html = await res.text();
    if (html.length > 2_000_000) html = html.slice(0, 2_000_000);
    return { ok: true, url: parsed.toString(), data: analyzeHtml(html) };
  } catch {
    return { ok: false, error: "Could not reach the URL (timeout or network error)." };
  } finally {
    clearTimeout(timer);
  }
}
