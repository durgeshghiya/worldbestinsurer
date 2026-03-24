import * as cheerio from 'cheerio';
import { BaseExtractor, ExtractedProduct, ExtractionResult } from './base-extractor';
import type { Category } from '../../../src/lib/types';

/**
 * Extractor for Care Health Insurance (formerly Religare) product pages.
 *
 * Care Health pages typically use:
 * - Plan cards with .plan-card, .product-card, or similar wrappers
 * - Feature comparison tables
 * - "Why Choose" or "Key Benefits" sections
 * - Tabbed plan views (Basic / Standard / Premium variants)
 */
export class CareHealthExtractor extends BaseExtractor {
  sourceId = 'care-health';
  insurerSlug = 'care-health';
  category: Category = 'health';

  async extract(html: string, url: string): Promise<ExtractionResult> {
    return this.timedExtract(url, 'care-health-scraper', async () => {
      const $ = this.load(html);
      const products: ExtractedProduct[] = [];
      const warnings: string[] = [];

      // Strategy 1: Product/plan cards
      const cards = this.findCards($);
      if (cards.length > 0) {
        cards.each((_, card) => {
          const product = this.extractFromCard($, $(card), url);
          if (product) products.push(product);
        });
      }

      // Strategy 2: Tabbed plan variants
      if (products.length === 0) {
        const tabProducts = this.extractFromTabs($, url);
        products.push(...tabProducts);
      }

      // Strategy 3: Comparison / feature table
      if (products.length === 0) {
        const tableProducts = this.extractFromTable($, url);
        products.push(...tableProducts);
      }

      // Strategy 4: Single product page
      if (products.length === 0) {
        const single = this.extractSingleProduct($, url);
        if (single) products.push(single);
      }

      if (products.length === 0) {
        warnings.push('No products extracted from Care Health page.');
      }

      return { products, warnings };
    });
  }

  private findCards($: cheerio.CheerioAPI): any {
    const selectors = [
      '.product-card',
      '.plan-card',
      '.plan-box',
      '.plan-item',
      '[class*="product-card"]',
      '[class*="planCard"]',
      '[class*="plan-card"]',
      '.card-plan',
      '.insurance-card',
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
    const nameEl = card.find('h2, h3, h4, .plan-name, .product-title, .card-title').first();
    const rawName = this.cleanText(nameEl.text());
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    const warnings: string[] = [];
    let confidence = 0.55;

    rawFields['insurerName'] = 'Care Health Insurance';
    rawFields['category'] = 'health';

    // Sum insured
    const sumText = this.labelValue($, card, [
      'sum insured',
      'cover amount',
      'coverage amount',
    ]);
    if (sumText) {
      rawFields['sumInsured'] = sumText;
      confidence += 0.1;
    }

    // Premium
    const premText = this.labelValue($, card, [
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
    const ageText = this.labelValue($, card, [
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

    // Waiting period
    const wpText = this.labelValue($, card, ['waiting period']);
    if (wpText) rawFields['waitingPeriod'] = wpText;

    // Renewability
    const renewText = this.labelValue($, card, ['renewability', 'renewable', 'renewal']);
    if (renewText) rawFields['renewability'] = renewText;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(confidence, 1),
      warnings,
    };
  }

  private extractFromTabs(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    // Care Health often uses tabs like .nav-tabs .nav-link or [role="tab"]
    const tabSelectors = [
      '.nav-tabs .nav-link, .nav-tabs .nav-item a',
      '[role="tab"]',
      '.tab-header button, .tab-header a',
      '.tabs li a',
    ];

    let tabLinks = $([]);
    for (const sel of tabSelectors) {
      tabLinks = $(sel);
      if (tabLinks.length > 1) break;
    }

    if (tabLinks.length < 2) return products;

    tabLinks.each((_, tab) => {
      const tabName = this.cleanText($(tab).text());
      if (!tabName || /faq|review|testimonial/i.test(tabName)) return;

      const targetId = $(tab).attr('href') || $(tab).attr('data-target') || $(tab).attr('aria-controls');
      if (!targetId) return;

      const panelSelector = targetId.startsWith('#') ? targetId : `#${targetId}`;
      const panel = $(panelSelector);
      if (!panel.length) return;

      const rawFields: Record<string, string | string[] | number | null> = {};
      rawFields['insurerName'] = 'Care Health Insurance';
      rawFields['category'] = 'health';

      const panelText = this.cleanText(panel.text());

      // Sum insured
      const sumMatch = panelText.match(
        /sum\s*insured[:\s]*(?:₹|Rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i
      );
      if (sumMatch) rawFields['sumInsured'] = sumMatch[1];

      // Premium
      const premMatch = panelText.match(
        /premium[:\s]*(?:₹|Rs\.?\s*)?([\d,.]+)/i
      );
      if (premMatch) rawFields['premium'] = premMatch[0];

      // Age
      const ageMatch = panelText.match(
        /(?:entry\s*)?age[:\s]*(\d+)\s*(?:-|to)\s*(\d+)/i
      );
      if (ageMatch) rawFields['eligibilityAge'] = `${ageMatch[1]}-${ageMatch[2]} years`;

      // Features
      const features: string[] = [];
      panel.find('li').each((__, li) => {
        const t = this.cleanText($(li).text());
        if (t && t.length > 5) features.push(t);
      });
      if (features.length > 0) rawFields['keyFeatures'] = features;

      if (Object.keys(rawFields).length > 2) {
        products.push({
          rawName: tabName,
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.45,
          warnings: ['Extracted from tab panel — verify completeness'],
        });
      }
    });

    return products;
  }

  private extractFromTable(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    const tables = $('table');
    tables.each((_, table) => {
      const rows = this.extractTable($, `#${$(table).attr('id') || ''}` || 'table');
      if (rows.length === 0) return;

      for (const row of rows) {
        const name =
          row['Plan'] || row['Plan Name'] || row['Product'] || row['Product Name'];
        if (!name) continue;

        const rawFields: Record<string, string | string[] | number | null> = {
          ...row,
          insurerName: 'Care Health Insurance',
          category: 'health',
        };

        products.push({
          rawName: this.cleanText(name),
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.45,
          warnings: ['Extracted from table — limited detail'],
        });
      }
    });

    return products;
  }

  private extractSingleProduct(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct | null {
    const title = this.cleanText($('h1').first().text() || $('title').text() || '');
    const rawName = title.replace(/\s*[-|–]\s*Care Health.*$/i, '').trim();
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    rawFields['insurerName'] = 'Care Health Insurance';
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

    // Claim settlement ratio
    const csrMatch = bodyText.match(/claim\s*settlement\s*ratio[:\s]*([\d.]+)\s*%/i);
    if (csrMatch) rawFields['claimSettlementRatio'] = csrMatch[1];

    // Features
    const features: string[] = [];
    $('ul, ol').each((_, list) => {
      const prevText = $(list).prev('h2, h3, h4, p, strong').text();
      if (/feature|benefit|inclusion|cover|advantage/i.test(prevText)) {
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
      const prevText = $(list).prev('h2, h3, h4, p, strong').text();
      if (/exclusion|not\s*cover|excluded/i.test(prevText)) {
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

  private labelValue(
    $: cheerio.CheerioAPI,
    scope: any,
    labels: string[]
  ): string | null {
    const scopeText = this.cleanText(scope.text());

    for (const label of labels) {
      // Pattern: "Label: Value" or "Label Value"
      const regex = new RegExp(label + '[:\\s]+([^\\n]{3,80})', 'i');
      const match = scopeText.match(regex);
      if (match) return match[1].trim();
    }

    // Look for label element followed by value element
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
            if (nextText && nextText !== elText) {
              found = nextText;
            }
          }
        }
      });

      if (found) return found;
    }

    return null;
  }
}
