import * as cheerio from 'cheerio';
import { BaseExtractor, ExtractedProduct, ExtractionResult } from './base-extractor';
import type { Category } from '../../../src/lib/types';

/**
 * Extractor for Star Health & Allied Insurance product pages.
 *
 * Star Health pages typically have:
 * - Product cards in a grid/list with class like .product-card, .plan-card
 * - Feature bullet lists inside each card
 * - Summary tables with coverage details
 * - "Key Features" / "Benefits" sections
 * - Premium calculator widgets (static text fallback)
 */
export class StarHealthExtractor extends BaseExtractor {
  sourceId = 'star-health';
  insurerSlug = 'star-health';
  category: Category = 'health';

  async extract(html: string, url: string): Promise<ExtractionResult> {
    return this.timedExtract(url, 'star-health-scraper', async () => {
      const $ = this.load(html);
      const products: ExtractedProduct[] = [];
      const warnings: string[] = [];

      // Strategy 1: Look for product/plan cards
      const cardSelectors = [
        '.product-card',
        '.plan-card',
        '.plan-box',
        '.product-box',
        '.insurance-plan',
        '.plan-item',
        '[class*="product-card"]',
        '[class*="plan-card"]',
        '[class*="planCard"]',
        '.card[data-product]',
      ];

      let cards = $([]);
      for (const sel of cardSelectors) {
        cards = $(sel);
        if (cards.length > 0) break;
      }

      if (cards.length > 0) {
        cards.each((_, card) => {
          const product = this.extractFromCard($, $(card), url);
          if (product) products.push(product);
        });
      }

      // Strategy 2: Look for comparison tables
      if (products.length === 0) {
        const tableProducts = this.extractFromComparisonTable($, url);
        products.push(...tableProducts);
      }

      // Strategy 3: Look for sections with plan headings (h2/h3)
      if (products.length === 0) {
        const sectionProducts = this.extractFromSections($, url);
        products.push(...sectionProducts);
      }

      // Strategy 4: Single product page
      if (products.length === 0) {
        const single = this.extractSingleProduct($, url);
        if (single) products.push(single);
      }

      if (products.length === 0) {
        warnings.push('No products found on page. HTML structure may have changed.');
      }

      return { products, warnings };
    });
  }

  private extractFromCard(
    $: cheerio.CheerioAPI,
    card: any,
    url: string
  ): ExtractedProduct | null {
    // Find product name from card heading
    const nameEl = card.find('h2, h3, h4, .plan-name, .product-name, .card-title').first();
    const rawName = this.cleanText(nameEl.text());
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    const warnings: string[] = [];
    let confidence = 0.6;

    // Extract features list
    const features = this.extractCardList($, card, [
      '.features li',
      '.benefits li',
      '.key-features li',
      'ul li',
    ]);
    if (features.length > 0) {
      rawFields['keyFeatures'] = features;
      confidence += 0.05;
    }

    // Extract sum insured
    const sumInsuredText = this.findTextByLabel($, card, [
      'sum insured',
      'cover amount',
      'coverage',
      'sum assured',
    ]);
    if (sumInsuredText) {
      rawFields['sumInsured'] = sumInsuredText;
      confidence += 0.1;
    }

    // Extract premium info
    const premiumText = this.findTextByLabel($, card, [
      'premium',
      'starting from',
      'starts at',
      'price',
    ]);
    if (premiumText) {
      rawFields['premium'] = premiumText;
      confidence += 0.1;
    }

    // Extract eligibility / age
    const ageText = this.findTextByLabel($, card, [
      'entry age',
      'age',
      'eligibility',
      'age limit',
    ]);
    if (ageText) {
      rawFields['eligibilityAge'] = ageText;
      confidence += 0.05;
    }

    // Extract waiting period
    const waitingText = this.findTextByLabel($, card, [
      'waiting period',
      'initial waiting',
    ]);
    if (waitingText) {
      rawFields['waitingPeriod'] = waitingText;
    }

    // Extract policy tenure
    const tenureText = this.findTextByLabel($, card, [
      'policy term',
      'tenure',
      'policy period',
    ]);
    if (tenureText) {
      rawFields['policyTenure'] = tenureText;
    }

    // Network hospitals
    const hospitalText = this.findTextByLabel($, card, [
      'network hospital',
      'cashless hospital',
    ]);
    if (hospitalText) {
      rawFields['networkHospitals'] = hospitalText;
    }

    // Claim settlement ratio from page-level info
    const csrText = this.findGlobalText($, [
      'claim settlement ratio',
      'claim settlement',
      'csr',
    ]);
    if (csrText) {
      rawFields['claimSettlementRatio'] = csrText;
    }

    rawFields['insurerName'] = 'Star Health and Allied Insurance';
    rawFields['category'] = 'health';

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(confidence, 1),
      warnings,
    };
  }

  private extractFromComparisonTable(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];
    const tableSelectors = [
      'table.comparison',
      'table.plan-comparison',
      '.comparison-table table',
      'table',
    ];

    for (const sel of tableSelectors) {
      const rows = this.extractTable($, sel);
      if (rows.length === 0) continue;

      // Check if this looks like a product comparison table
      const headers = Object.keys(rows[0] || {});
      const looksLikeProductTable = headers.some(
        (h) =>
          /plan|product|feature|benefit/i.test(h) ||
          /sum\s*insured|premium|cover/i.test(h)
      );

      if (!looksLikeProductTable && headers.length < 2) continue;

      // If columns are plan names (transposed table)
      const planHeaders = headers.filter(
        (h) => !/feature|benefit|parameter|details/i.test(h)
      );

      if (planHeaders.length >= 2) {
        // Each non-feature column is a plan
        for (const planName of planHeaders) {
          if (!planName) continue;
          const rawFields: Record<string, string | string[] | number | null> = {};
          rawFields['insurerName'] = 'Star Health and Allied Insurance';
          rawFields['category'] = 'health';

          for (const row of rows) {
            const featureKey = Object.keys(row).find((k) =>
              /feature|benefit|parameter|details/i.test(k)
            );
            if (featureKey && row[featureKey]) {
              rawFields[row[featureKey]] = row[planName] || null;
            }
          }

          products.push({
            rawName: planName,
            rawFields,
            sourceUrl: url,
            extractionConfidence: 0.5,
            warnings: ['Extracted from comparison table — verify field mapping'],
          });
        }
        break;
      }

      // Standard table: each row is a product
      for (const row of rows) {
        const name =
          row['Plan Name'] ||
          row['Product Name'] ||
          row['Plan'] ||
          row['Product'] ||
          Object.values(row)[0];
        if (!name) continue;

        const rawFields: Record<string, string | string[] | number | null> = {
          ...row,
          insurerName: 'Star Health and Allied Insurance',
          category: 'health',
        };

        products.push({
          rawName: this.cleanText(name),
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.45,
          warnings: ['Extracted from table row — limited detail'],
        });
      }
      break;
    }

    return products;
  }

  private extractFromSections(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    $('h2, h3').each((_, heading) => {
      const headingText = this.cleanText($(heading).text());

      // Skip generic headings
      if (
        /faq|contact|about|disclaimer|footer|header|navigation|menu/i.test(
          headingText
        )
      )
        return;

      // Check if heading looks like a plan name
      if (
        !/plan|policy|insurance|cover|protect|care|health|shield|assure/i.test(
          headingText
        )
      )
        return;

      const rawFields: Record<string, string | string[] | number | null> = {};
      rawFields['insurerName'] = 'Star Health and Allied Insurance';
      rawFields['category'] = 'health';

      // Gather text and lists from following siblings until next heading
      const section = $(heading).nextUntil('h2, h3');
      const sectionText = this.cleanText(section.text());

      // Extract features from any lists in the section
      const features: string[] = [];
      section.find('li').each((_, li) => {
        const t = this.cleanText($(li).text());
        if (t) features.push(t);
      });
      if (features.length > 0) rawFields['keyFeatures'] = features;

      // Parse sum insured from section text
      const sumMatch = sectionText.match(
        /sum\s*insured[:\s]*(?:up\s*to\s*)?(?:₹|Rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr|L)\b)/i
      );
      if (sumMatch) rawFields['sumInsured'] = sumMatch[1];

      // Parse age from section text
      const ageMatch = sectionText.match(
        /(?:entry\s*)?age[:\s]*(\d+)\s*(?:-|to)\s*(\d+)/i
      );
      if (ageMatch) rawFields['eligibilityAge'] = `${ageMatch[1]}-${ageMatch[2]} years`;

      // Parse premium
      const premMatch = sectionText.match(
        /premium[:\s]*(?:starting\s*(?:from|at)\s*)?(?:₹|Rs\.?\s*)?([\d,.]+)/i
      );
      if (premMatch) rawFields['premium'] = premMatch[0];

      if (Object.keys(rawFields).length > 2) {
        products.push({
          rawName: headingText,
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.4,
          warnings: ['Extracted from page section — may be incomplete'],
        });
      }
    });

    return products;
  }

  private extractSingleProduct(
    $: cheerio.CheerioAPI,
    url: string
  ): ExtractedProduct | null {
    // Attempt to extract a single product from the entire page
    const title =
      $('h1').first().text() ||
      $('title').text() ||
      '';
    const rawName = this.cleanText(title).replace(
      /\s*[-|–]\s*Star Health.*$/i,
      ''
    );
    if (!rawName) return null;

    const rawFields: Record<string, string | string[] | number | null> = {};
    rawFields['insurerName'] = 'Star Health and Allied Insurance';
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

    // Features
    const features: string[] = [];
    $('ul, ol').each((_, list) => {
      const parent = $(list).parent();
      const prevHeading = parent.find('h2, h3, h4').last().text();
      if (/feature|benefit|inclusion|cover/i.test(prevHeading)) {
        $(list)
          .find('li')
          .each((__, li) => {
            const t = this.cleanText($(li).text());
            if (t) features.push(t);
          });
      }
    });
    if (features.length > 0) rawFields['keyFeatures'] = features;

    // Exclusions
    const exclusions: string[] = [];
    $('ul, ol').each((_, list) => {
      const parent = $(list).parent();
      const prevHeading = parent.find('h2, h3, h4').last().text();
      if (/exclusion|not\s*cover|excluded/i.test(prevHeading)) {
        $(list)
          .find('li')
          .each((__, li) => {
            const t = this.cleanText($(li).text());
            if (t) exclusions.push(t);
          });
      }
    });
    if (exclusions.length > 0) rawFields['keyExclusions'] = exclusions;

    // Network hospitals
    const hospMatch = bodyText.match(
      /(\d[\d,]+)\s*\+?\s*(?:network\s*)?hospital/i
    );
    if (hospMatch) rawFields['networkHospitals'] = hospMatch[1];

    // Claim settlement
    const csrMatch = bodyText.match(
      /claim\s*settlement\s*ratio[:\s]*([\d.]+)\s*%/i
    );
    if (csrMatch) rawFields['claimSettlementRatio'] = csrMatch[1];

    const fieldCount = Object.keys(rawFields).length;
    if (fieldCount <= 2) return null;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(0.3 + fieldCount * 0.05, 0.8),
      warnings: ['Single product page extraction — verify completeness'],
    };
  }

  // ── Helpers ──

  private extractCardList(
    $: cheerio.CheerioAPI,
    card: any,
    selectors: string[]
  ): string[] {
    for (const sel of selectors) {
      const items: string[] = [];
      card.find(sel).each((_, li) => {
        const t = this.cleanText($(li).text());
        if (t) items.push(t);
      });
      if (items.length > 0) return items;
    }
    return [];
  }

  private findTextByLabel(
    $: cheerio.CheerioAPI,
    scope: any,
    labels: string[]
  ): string | null {
    // Look for label: value patterns inside the scope
    for (const label of labels) {
      // Check for elements with matching text
      const regex = new RegExp(label, 'i');

      let found: string | null = null;

      scope.find('*').each((_, el) => {
        if (found) return;
        const text = this.cleanText($(el).text());
        if (regex.test(text)) {
          // Get the value — could be in a sibling, next element, or after a colon
          const sibling = $(el).next();
          if (sibling.length) {
            const sibText = this.cleanText(sibling.text());
            if (sibText && sibText !== text) {
              found = sibText;
              return;
            }
          }

          // Try extracting value after colon
          const colonMatch = text.match(
            new RegExp(label + '[:\\s]+(.+)', 'i')
          );
          if (colonMatch) {
            found = colonMatch[1].trim();
            return;
          }
        }
      });

      if (found) return found;
    }
    return null;
  }

  private findGlobalText(
    $: cheerio.CheerioAPI,
    labels: string[]
  ): string | null {
    const bodyText = this.cleanText($('body').text());
    for (const label of labels) {
      const regex = new RegExp(
        label + '[:\\s]+(\\d[\\d.,%\\s]*)',
        'i'
      );
      const match = bodyText.match(regex);
      if (match) return match[1].trim();
    }
    return null;
  }
}
