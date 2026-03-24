import * as cheerio from 'cheerio';
import { BaseExtractor, ExtractedProduct, ExtractionResult } from './base-extractor';
import type { Category } from '../../../src/lib/types';

/**
 * Extractor for HDFC ERGO General Insurance product pages.
 *
 * HDFC ERGO pages typically use:
 * - Product listing with .product-card or grid layouts
 * - "Plan at a Glance" summary tables
 * - Feature icons with descriptions in rows
 * - Multi-category pages (health, motor, travel on same site)
 */
export class HdfcErgoExtractor extends BaseExtractor {
  sourceId = 'hdfc-ergo';
  insurerSlug = 'hdfc-ergo';
  category: Category = 'health';

  async extract(html: string, url: string): Promise<ExtractionResult> {
    // Detect category from URL
    if (/motor|car|bike|vehicle|two-wheeler/i.test(url)) {
      this.category = 'motor';
    } else if (/travel/i.test(url)) {
      this.category = 'travel';
    } else if (/term|life/i.test(url)) {
      this.category = 'term-life';
    } else {
      this.category = 'health';
    }

    return this.timedExtract(url, 'hdfc-ergo-scraper', async () => {
      const $ = this.load(html);
      const products: ExtractedProduct[] = [];
      const warnings: string[] = [];

      // Strategy 1: Product cards
      const cards = this.findCards($);
      if (cards.length > 0) {
        cards.each((_, card) => {
          const product = this.extractFromCard($, $(card), url);
          if (product) products.push(product);
        });
      }

      // Strategy 2: "Plan at a Glance" tables (common on HDFC ERGO)
      if (products.length === 0) {
        const glanceProducts = this.extractFromGlanceTable($, url);
        products.push(...glanceProducts);
      }

      // Strategy 3: Feature grid (icon + description rows)
      if (products.length === 0) {
        const gridProducts = this.extractFromFeatureGrid($, url);
        products.push(...gridProducts);
      }

      // Strategy 4: Single product page
      if (products.length === 0) {
        const single = this.extractSingleProduct($, url);
        if (single) products.push(single);
      }

      if (products.length === 0) {
        warnings.push('No products extracted from HDFC ERGO page.');
      }

      return { products, warnings };
    });
  }

  private findCards($: cheerio.CheerioAPI): any {
    const selectors = [
      '.product-card',
      '.plan-card',
      '.plan-box',
      '[class*="product-card"]',
      '[class*="planCard"]',
      '[class*="plan-card"]',
      '.product-listing .card',
      '.plans-section .card',
      '.insurance-plan',
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
    const nameEl = card.find('h2, h3, h4, .plan-name, .product-name, .card-title').first();
    const rawName = this.cleanText(nameEl.text());
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    const warnings: string[] = [];
    let confidence = 0.55;

    rawFields['insurerName'] = 'HDFC ERGO General Insurance';
    rawFields['category'] = this.category;

    // Sum insured
    const sumText = this.findLabelValue(card, $, [
      'sum insured',
      'cover amount',
      'coverage',
      'sum assured',
      'si',
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
      'age limit',
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

    // Claim settlement
    const csrText = this.findLabelValue(card, $, [
      'claim settlement',
      'csr',
      'claim ratio',
    ]);
    if (csrText) rawFields['claimSettlementRatio'] = csrText;

    // Waiting period
    const wpText = this.findLabelValue(card, $, ['waiting period']);
    if (wpText) rawFields['waitingPeriod'] = wpText;

    // Policy tenure
    const tenureText = this.findLabelValue(card, $, [
      'policy term',
      'tenure',
      'policy period',
    ]);
    if (tenureText) rawFields['policyTenure'] = tenureText;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(confidence, 1),
      warnings,
    };
  }

  private extractFromGlanceTable(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    // Look for "Plan at a Glance" or summary tables
    const glanceHeadings = $('h2, h3, h4').filter((_, el) =>
      /plan\s*at\s*a\s*glance|plan\s*summary|plan\s*details|plan\s*comparison/i.test(
        $(el).text()
      )
    );

    glanceHeadings.each((_, heading) => {
      const table = $(heading).nextAll('table').first();
      if (!table.length) return;

      const rows = this.extractTable($, 'table');
      if (rows.length === 0) return;

      // Detect if columns are plan names
      const headers = Object.keys(rows[0] || {});
      const featureCol = headers.find((h) =>
        /feature|benefit|parameter|details|particulars/i.test(h)
      );
      const planCols = headers.filter((h) => h !== featureCol);

      if (featureCol && planCols.length > 0) {
        // Transposed table: columns = plans, rows = features
        for (const planName of planCols) {
          const rawFields: Record<string, string | string[] | number | null> = {};
          rawFields['insurerName'] = 'HDFC ERGO General Insurance';
          rawFields['category'] = this.category;

          for (const row of rows) {
            if (row[featureCol]) {
              rawFields[row[featureCol]] = row[planName] || null;
            }
          }

          products.push({
            rawName: this.cleanText(planName),
            rawFields,
            sourceUrl: url,
            extractionConfidence: 0.5,
            warnings: ['Extracted from glance table'],
          });
        }
      } else {
        // Standard table: each row is a product
        for (const row of rows) {
          const name = row['Plan'] || row['Plan Name'] || row['Product'] || Object.values(row)[0];
          if (!name) continue;

          products.push({
            rawName: this.cleanText(name),
            rawFields: {
              ...row,
              insurerName: 'HDFC ERGO General Insurance',
              category: this.category,
            },
            sourceUrl: url,
            extractionConfidence: 0.45,
            warnings: ['Extracted from glance table row'],
          });
        }
      }
    });

    return products;
  }

  private extractFromFeatureGrid(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    // HDFC ERGO uses icon-grid or feature-grid layouts
    const gridSelectors = [
      '.feature-grid',
      '.icon-grid',
      '.benefits-grid',
      '[class*="feature-grid"]',
      '[class*="benefits-section"]',
    ];

    let grid = $([]);
    for (const sel of gridSelectors) {
      grid = $(sel);
      if (grid.length > 0) break;
    }

    if (grid.length === 0) return products;

    // If there's a single product name and the grid shows its features
    const pageTitle = this.cleanText($('h1').first().text() || '');
    if (!pageTitle) return products;

    const rawFields: Record<string, string | string[] | number | null> = {};
    rawFields['insurerName'] = 'HDFC ERGO General Insurance';
    rawFields['category'] = this.category;

    const features: string[] = [];
    grid.find('.feature-item, .grid-item, .benefit-item, [class*="feature"], [class*="benefit"]').each(
      (_, item) => {
        const t = this.cleanText($(item).text());
        if (t && t.length > 5) features.push(t);
      }
    );
    if (features.length > 0) rawFields['keyFeatures'] = features;

    // Try to get sum insured and premium from page text
    const bodyText = this.cleanText($('body').text());
    const sumMatch = bodyText.match(
      /sum\s*insured[:\s]*(?:up\s*to\s*)?(?:₹|Rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i
    );
    if (sumMatch) rawFields['sumInsured'] = sumMatch[1];

    const premMatch = bodyText.match(
      /premium[:\s]*(?:starting\s*(?:from|at)\s*)?(?:₹|Rs\.?\s*)?([\d,.]+)/i
    );
    if (premMatch) rawFields['premium'] = premMatch[0];

    if (Object.keys(rawFields).length > 2) {
      products.push({
        rawName: pageTitle.replace(/\s*[-|–]\s*HDFC ERGO.*$/i, ''),
        rawFields,
        sourceUrl: url,
        extractionConfidence: 0.4,
        warnings: ['Extracted from feature grid — single product'],
      });
    }

    return products;
  }

  private extractSingleProduct(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct | null {
    const title = this.cleanText($('h1').first().text() || $('title').text() || '');
    const rawName = title.replace(/\s*[-|–]\s*HDFC ERGO.*$/i, '').trim();
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    rawFields['insurerName'] = 'HDFC ERGO General Insurance';
    rawFields['category'] = this.category;

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
      if (/feature|benefit|inclusion|cover|advantage|highlight/i.test(prev)) {
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

    // Riders
    const riders: string[] = [];
    $('ul, ol').each((_, list) => {
      const prev = $(list).prev('h2, h3, h4, p, strong').text();
      if (/rider|add-on|addon|optional/i.test(prev)) {
        $(list).find('li').each((__, li) => {
          const t = this.cleanText($(li).text());
          if (t) riders.push(t);
        });
      }
    });
    if (riders.length > 0) rawFields['riders'] = riders;

    // Policy tenure
    const tenureMatch = bodyText.match(
      /policy\s*(?:term|tenure|period)[:\s]*([\d]+\s*(?:year|month)s?(?:\s*(?:to|-)\s*[\d]+\s*(?:year|month)s?)?)/i
    );
    if (tenureMatch) rawFields['policyTenure'] = tenureMatch[1];

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
