import * as cheerio from 'cheerio';
import { BaseExtractor, ExtractedProduct, ExtractionResult } from './base-extractor';
import type { Category } from '../../../src/lib/types';

/**
 * Extractor for Niva Bupa (formerly Max Bupa) Health Insurance product pages.
 *
 * Niva Bupa pages typically use:
 * - Product listing grids with .product-card or .plan-tile
 * - Accordion-style feature sections
 * - Side-by-side plan comparison layouts
 * - "Plan Highlights" sections with icon + text pairs
 */
export class NivaBupaExtractor extends BaseExtractor {
  sourceId = 'niva-bupa';
  insurerSlug = 'niva-bupa';
  category: Category = 'health';

  async extract(html: string, url: string): Promise<ExtractionResult> {
    return this.timedExtract(url, 'niva-bupa-scraper', async () => {
      const $ = this.load(html);
      const products: ExtractedProduct[] = [];
      const warnings: string[] = [];

      // Strategy 1: Product cards / tiles
      const cards = this.findCards($);
      if (cards.length > 0) {
        cards.each((_, card) => {
          const product = this.extractFromCard($, $(card), url);
          if (product) products.push(product);
        });
      }

      // Strategy 2: Accordion sections (Niva Bupa uses these for plan details)
      if (products.length === 0) {
        const accordionProducts = this.extractFromAccordions($, url);
        products.push(...accordionProducts);
      }

      // Strategy 3: Comparison table
      if (products.length === 0) {
        const tableProducts = this.extractFromComparisonTable($, url);
        products.push(...tableProducts);
      }

      // Strategy 4: Single product page with structured sections
      if (products.length === 0) {
        const single = this.extractSingleProduct($, url);
        if (single) products.push(single);
      }

      if (products.length === 0) {
        warnings.push('No products extracted from Niva Bupa page.');
      }

      return { products, warnings };
    });
  }

  private findCards($: cheerio.CheerioAPI): any {
    const selectors = [
      '.product-card',
      '.plan-tile',
      '.plan-card',
      '.product-tile',
      '[class*="product-card"]',
      '[class*="plan-tile"]',
      '[class*="planCard"]',
      '.plan-box',
      '.product-listing .card',
    ];
    for (const sel of selectors) {
      const found = $(sel);
      if (found.length > 0) return found;
    }
    return $([]);
  }

  private extractFromCard(
    $: cheerio.CheerioAPI,
    card: any,
    url: string
  ): ExtractedProduct | null {
    const nameEl = card.find('h2, h3, h4, .plan-name, .product-name, .card-title, .tile-title').first();
    const rawName = this.cleanText(nameEl.text());
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    const warnings: string[] = [];
    let confidence = 0.55;

    rawFields['insurerName'] = 'Niva Bupa Health Insurance';
    rawFields['category'] = 'health';

    // Sum insured
    const sumText = this.findLabelValue(card, $, [
      'sum insured',
      'cover',
      'coverage',
      'sum assured',
    ]);
    if (sumText) {
      rawFields['sumInsured'] = sumText;
      confidence += 0.1;
    }

    // Premium
    const premText = this.findLabelValue(card, $, [
      'premium',
      'starting',
      'price',
      'starts at',
    ]);
    if (premText) {
      rawFields['premium'] = premText;
      confidence += 0.1;
    }

    // Age
    const ageText = this.findLabelValue(card, $, [
      'entry age',
      'age',
      'eligibility',
    ]);
    if (ageText) {
      rawFields['eligibilityAge'] = ageText;
      confidence += 0.05;
    }

    // Features
    const features: string[] = [];
    card.find('li').each((_, li) => {
      const t = this.cleanText($(li).text());
      if (t && t.length > 5 && t.length < 300) features.push(t);
    });
    if (features.length > 0) {
      rawFields['keyFeatures'] = features;
      confidence += 0.05;
    }

    // Highlight badges / tags (Niva Bupa often shows tags)
    const tags: string[] = [];
    card.find('.badge, .tag, [class*="badge"], [class*="tag"], .highlight').each((_, el) => {
      const t = this.cleanText($(el).text());
      if (t) tags.push(t);
    });
    if (tags.length > 0) rawFields['specialFeatures'] = tags;

    // Waiting period
    const wpText = this.findLabelValue(card, $, ['waiting period']);
    if (wpText) rawFields['waitingPeriod'] = wpText;

    // Renewability
    const renewText = this.findLabelValue(card, $, ['renewab', 'renewal']);
    if (renewText) rawFields['renewability'] = renewText;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(confidence, 1),
      warnings,
    };
  }

  private extractFromAccordions(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    const accordionSelectors = [
      '.accordion-item',
      '.accordion .card',
      '[class*="accordion"] [class*="item"]',
      '.collapse-item',
      '.expandable-section',
    ];

    let items = $([]);
    for (const sel of accordionSelectors) {
      items = $(sel);
      if (items.length > 0) break;
    }

    items.each((_, item) => {
      const header = $(item).find(
        '.accordion-header, .card-header, [class*="header"], button, h3, h4'
      ).first();
      const headerText = this.cleanText(header.text());

      if (!headerText || !/plan|policy|cover|health|care|protect/i.test(headerText)) return;

      const body = $(item).find(
        '.accordion-body, .accordion-collapse, .card-body, [class*="body"], [class*="content"]'
      ).first();
      const bodyText = this.cleanText(body.text());

      const rawFields: Record<string, string | string[] | number | null> = {};
      rawFields['insurerName'] = 'Niva Bupa Health Insurance';
      rawFields['category'] = 'health';

      // Parse fields from body text
      const sumMatch = bodyText.match(
        /sum\s*insured[:\s]*(?:up\s*to\s*)?(?:₹|Rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i
      );
      if (sumMatch) rawFields['sumInsured'] = sumMatch[1];

      const ageMatch = bodyText.match(
        /(?:entry\s*)?age[:\s]*(\d+)\s*(?:-|to)\s*(\d+)/i
      );
      if (ageMatch) rawFields['eligibilityAge'] = `${ageMatch[1]}-${ageMatch[2]} years`;

      const premMatch = bodyText.match(
        /premium[:\s]*(?:starting\s*(?:from|at)\s*)?(?:₹|Rs\.?\s*)?([\d,.]+)/i
      );
      if (premMatch) rawFields['premium'] = premMatch[0];

      // Features from list items in body
      const features: string[] = [];
      body.find('li').each((__, li) => {
        const t = this.cleanText($(li).text());
        if (t && t.length > 5) features.push(t);
      });
      if (features.length > 0) rawFields['keyFeatures'] = features;

      if (Object.keys(rawFields).length > 2) {
        products.push({
          rawName: headerText,
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.45,
          warnings: ['Extracted from accordion — verify completeness'],
        });
      }
    });

    return products;
  }

  private extractFromComparisonTable(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    const tableSelectors = [
      'table.comparison',
      '.comparison-table table',
      '.plan-comparison table',
      'table',
    ];

    for (const sel of tableSelectors) {
      const rows = this.extractTable($, sel);
      if (rows.length === 0) continue;

      const headers = Object.keys(rows[0] || {});
      const hasProductInfo = headers.some(
        (h) => /plan|product|feature|sum|premium|cover/i.test(h)
      );
      if (!hasProductInfo && headers.length < 2) continue;

      for (const row of rows) {
        const name =
          row['Plan Name'] || row['Plan'] || row['Product'] || row['Product Name'];
        if (!name) continue;

        const rawFields: Record<string, string | string[] | number | null> = {
          ...row,
          insurerName: 'Niva Bupa Health Insurance',
          category: 'health',
        };

        products.push({
          rawName: this.cleanText(name),
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.45,
          warnings: ['Extracted from comparison table'],
        });
      }

      if (products.length > 0) break;
    }

    return products;
  }

  private extractSingleProduct(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct | null {
    const title = this.cleanText($('h1').first().text() || $('title').text() || '');
    const rawName = title
      .replace(/\s*[-|–]\s*(?:Niva Bupa|Max Bupa).*$/i, '')
      .trim();
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    rawFields['insurerName'] = 'Niva Bupa Health Insurance';
    rawFields['category'] = 'health';

    const bodyText = this.cleanText($('body').text());

    // Sum insured
    const sumMatch = bodyText.match(
      /sum\s*insured[:\s]*(?:up\s*to\s*)?(?:₹|Rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i
    );
    if (sumMatch) rawFields['sumInsured'] = sumMatch[1];

    // Age
    const ageMatch = bodyText.match(
      /(?:entry\s*)?age[:\s]*(\d+)\s*(?:-|to)\s*(\d+)/i
    );
    if (ageMatch) rawFields['eligibilityAge'] = `${ageMatch[1]}-${ageMatch[2]} years`;

    // Premium
    const premMatch = bodyText.match(
      /premium[:\s]*(?:starting\s*(?:from|at)\s*)?(?:₹|Rs\.?\s*)?([\d,.]+)/i
    );
    if (premMatch) rawFields['premium'] = premMatch[0];

    // Waiting period
    const wpMatch = bodyText.match(
      /waiting\s*period[:\s]*([\d]+\s*(?:days?|months?|years?))/i
    );
    if (wpMatch) rawFields['waitingPeriod'] = wpMatch[1];

    // Network hospitals
    const hospMatch = bodyText.match(/(\d[\d,]+)\s*\+?\s*(?:network\s*)?hospital/i);
    if (hospMatch) rawFields['networkHospitals'] = hospMatch[1];

    // CSR
    const csrMatch = bodyText.match(/claim\s*settlement\s*ratio[:\s]*([\d.]+)\s*%/i);
    if (csrMatch) rawFields['claimSettlementRatio'] = csrMatch[1];

    // Features
    const features: string[] = [];
    $('ul, ol').each((_, list) => {
      const prev = $(list).prev('h2, h3, h4, p, strong').text();
      if (/feature|benefit|inclusion|cover|highlight|advantage/i.test(prev)) {
        $(list).find('li').each((__, li) => {
          const t = this.cleanText($(li).text());
          if (t) features.push(t);
        });
      }
    });
    if (features.length > 0) rawFields['keyFeatures'] = features;

    // Exclusions
    const exclusions: string[] = [];
    $('ul, ol').each((_, list) => {
      const prev = $(list).prev('h2, h3, h4, p, strong').text();
      if (/exclusion|not\s*cover|excluded/i.test(prev)) {
        $(list).find('li').each((__, li) => {
          const t = this.cleanText($(li).text());
          if (t) exclusions.push(t);
        });
      }
    });
    if (exclusions.length > 0) rawFields['keyExclusions'] = exclusions;

    const fieldCount = Object.keys(rawFields).length;
    if (fieldCount <= 2) return null;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(0.3 + fieldCount * 0.05, 0.8),
      warnings: ['Single product page extraction'],
    };
  }

  private findLabelValue(
    scope: any,
    $: cheerio.CheerioAPI,
    labels: string[]
  ): string | null {
    const scopeText = this.cleanText(scope.text());

    for (const label of labels) {
      const regex = new RegExp(label + '[:\\s]+([^\\n]{3,80})', 'i');
      const match = scopeText.match(regex);
      if (match) return match[1].trim();
    }

    for (const label of labels) {
      const re = new RegExp(label, 'i');
      let found: string | null = null;

      scope.find('*').each((_, el) => {
        if (found) return;
        const elText = this.cleanText($(el).text());
        if (re.test(elText) && $(el).children().length === 0) {
          const next = $(el).next();
          if (next.length) {
            const nextText = this.cleanText(next.text());
            if (nextText && nextText !== elText) found = nextText;
          }
        }
      });

      if (found) return found;
    }

    return null;
  }
}
