/**
 * Turn a fetched page into the text that evidence is checked against.
 *
 * Two layers, kept separate and labelled:
 *   visible   — what a reader sees (scripts, styles and hidden chrome removed)
 *   embedded  — structured data the page ships (JSON-LD, __NEXT_DATA__ etc.)
 *
 * Evidence found only in the embedded layer is still the insurer's own
 * published data, but provenance records that it was not visible text.
 */

import * as cheerio from "cheerio";

export interface PageText {
  visible: string;
  embedded: string;
  links: { href: string; text: string }[];
  title: string;
}

/** Normalise for comparison: NFKC, strip zero-width, collapse space, lowercase. */
export function norm(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/[​-‍﻿­]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function extractPage(html: string, baseUrl: string): PageText {
  const $ = cheerio.load(html);

  const embedded: string[] = [];
  $('script[type="application/ld+json"], script[type="application/json"], script#__NEXT_DATA__').each((_, el) => {
    embedded.push($(el).text());
  });

  const links: PageText["links"] = [];
  $("a[href]").each((_, el) => {
    const raw = $(el).attr("href") ?? "";
    if (!raw || raw.startsWith("#") || raw.startsWith("javascript:") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;
    try {
      links.push({ href: new URL(raw, baseUrl).toString(), text: $(el).text().replace(/\s+/g, " ").trim() });
    } catch {
      /* ignore malformed hrefs */
    }
  });

  $("script, style, noscript, svg, template, iframe").remove();
  // Block-level breaks so adjacent cells don't fuse into one word.
  $("br, p, div, li, td, th, tr, h1, h2, h3, h4, h5, h6, section, footer, header").each((_, el) => {
    $(el).append(" ");
  });

  return {
    title: $("title").first().text().trim(),
    visible: $("body").text().replace(/\s+/g, " ").trim(),
    embedded: embedded.join("\n"),
    links,
  };
}

/** Plain-text files (operator exports of PDFs, CSVs) go through the same shape. */
export function extractPlain(text: string): PageText {
  return { title: "", visible: text.replace(/\s+/g, " ").trim(), embedded: "", links: [] };
}
