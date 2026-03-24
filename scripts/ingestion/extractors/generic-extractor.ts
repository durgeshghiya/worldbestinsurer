import * as cheerio from 'cheerio';
import { BaseExtractor, ExtractedProduct, ExtractionResult } from './base-extractor';
import type { Category } from '../../../src/lib/types';

/**
 * Generic / fallback extractor that uses regex patterns to find insurance
 * product information in any HTML page. Works across insurers by scanning
 * for common Indian insurance terminology.
 */
export class GenericExtractor extends BaseExtractor {
  sourceId = 'generic';
  insurerSlug = 'unknown';
  category: Category = 'health';

  private insurerSlugOverride: string | null = null;
  private categoryOverride: Category | null = null;

  /**
   * Allow callers to set insurer context before extraction.
   */
  setContext(insurerSlug: string, category: Category): void {
    this.insurerSlugOverride = insurerSlug;
    this.categoryOverride = category;
  }

  async extract(html: string, url: string): Promise<ExtractionResult> {
    if (this.insurerSlugOverride) this.insurerSlug = this.insurerSlugOverride;
    if (this.categoryOverride) this.category = this.categoryOverride;

    // Auto-detect category from URL
    if (!this.categoryOverride) {
      this.category = this.detectCategory(url, html);
    }

    return this.timedExtract(url, 'generic-regex-scraper', async () => {
      const $ = this.load(html);
      const products: ExtractedProduct[] = [];
      const warnings: string[] = [];

      // Try to detect insurer name if not set
      const insurerName = this.detectInsurerName($, url);

      // Strategy 1: Find product cards via common patterns
      const cardProducts = this.extractFromCards($, url, insurerName);
      products.push(...cardProducts);

      // Strategy 2: Find comparison tables
      if (products.length === 0) {
        const tableProducts = this.extractFromTables($, url, insurerName);
        products.push(...tableProducts);
      }

      // Strategy 3: Extract structured data (JSON-LD, microdata)
      if (products.length === 0) {
        const structuredProducts = this.extractFromStructuredData($, url, insurerName);
        products.push(...structuredProducts);
      }

      // Strategy 4: Regex-based extraction from full page text
      if (products.length === 0) {
        const regexProduct = this.extractFromRegex($, url, insurerName);
        if (regexProduct) products.push(regexProduct);
      }

      if (products.length === 0) {
        warnings.push(
          'Generic extractor could not identify insurance products. The page may not contain structured product data.'
        );
      }

      return { products, warnings };
    });
  }

  private detectCategory(url: string, html: string): Category {
    const combined = (url + ' ' + html.substring(0, 5000)).toLowerCase();
    if (/motor|car\s*insurance|vehicle|two-wheeler|bike\s*insurance/i.test(combined)) return 'motor';
    if (/travel\s*insurance|overseas|international\s*travel/i.test(combined)) return 'travel';
    if (/term\s*(?:life|plan|insurance)|life\s*insurance|term\s*assurance/i.test(combined)) return 'term-life';
    return 'health';
  }

  private detectInsurerName(
    $: cheerio.CheerioAPI,
    url: string
  ): string {
    // Try meta tags
    const ogSiteName = $('meta[property="og:site_name"]').attr('content');
    if (ogSiteName) return this.cleanText(ogSiteName);

    // Try common logo alt text
    const logoAlt = $('img.logo, .logo img, [class*="logo"] img, header img').first().attr('alt');
    if (logoAlt) return this.cleanText(logoAlt);

    // Extract from domain
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.replace(/^www\./, '').split('.');
      if (parts.length > 0) {
        return parts[0]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    } catch {
      // ignore URL parse failures
    }

    return 'Unknown Insurer';
  }

  private extractFromCards(
    $: cheerio.CheerioAPI,
    url: string,
    insurerName: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    // Broad card selectors
    const selectors = [
      '.product-card', '.plan-card', '.plan-box', '.plan-item',
      '[class*="product-card"]', '[class*="plan-card"]', '[class*="planCard"]',
      '.card', '.insurance-card', '.plan-tile',
    ];

    let cards = $([]);
    for (const sel of selectors) {
      cards = $(sel);
      if (cards.length > 0 && cards.length <= 20) break;
    }

    // Filter: only keep cards that look like insurance products
    cards.each((_, card) => {
      const cardText = this.cleanText($(card).text()).toLowerCase();
      const isInsuranceRelated =
        /premium|sum\s*insured|cover|plan|policy|insur/i.test(cardText);
      if (!isInsuranceRelated) return;

      const nameEl = $(card).find('h2, h3, h4, .card-title, .plan-name, .product-name').first();
      const rawName = this.cleanText(nameEl.text());
      if (!rawName || rawName.length < 3) return;

      const rawFields = this.extractFieldsFromText(cardText, insurerName);

      // Features from list items
      const features: string[] = [];
      $(card).find('li').each((__, li) => {
        const t = this.cleanText($(li).text());
        if (t && t.length > 5 && t.length < 300) features.push(t);
      });
      if (features.length > 0) rawFields['keyFeatures'] = features;

      const fieldCount = Object.keys(rawFields).length;
      products.push({
        rawName,
        rawFields,
        sourceUrl: url,
        extractionConfidence: Math.min(0.25 + fieldCount * 0.04, 0.65),
        warnings: ['Generic card extraction — verify all fields'],
      });
    });

    return products;
  }

  private extractFromTables(
    $: cheerio.CheerioAPI,
    url: string,
    insurerName: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    $('table').each((_, table) => {
      const tableText = this.cleanText($(table).text()).toLowerCase();
      const isRelevant =
        /premium|sum\s*insured|cover|plan|policy|benefit|feature/i.test(tableText);
      if (!isRelevant) return;

      const rows = this.extractTable($, 'table');
      if (rows.length === 0) return;

      const headers = Object.keys(rows[0] || {});

      for (const row of rows) {
        const name =
          row['Plan'] || row['Plan Name'] || row['Product'] ||
          row['Product Name'] || row['Name'] || Object.values(row)[0];
        if (!name || name.length < 3) continue;

        const rawFields: Record<string, string | string[] | number | null> = {
          ...row,
          insurerName,
          category: this.category,
        };

        products.push({
          rawName: this.cleanText(name),
          rawFields,
          sourceUrl: url,
          extractionConfidence: 0.35,
          warnings: ['Generic table extraction — verify field mapping'],
        });
      }

      // Only process first relevant table
      if (products.length > 0) return false;
    });

    return products;
  }

  private extractFromStructuredData(
    $: cheerio.CheerioAPI,
    url: string,
    insurerName: string
  ): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];

    // Look for JSON-LD
    $('script[type="application/ld+json"]').each((_, script) => {
      try {
        const jsonText = $(script).html();
        if (!jsonText) return;

        const data = JSON.parse(jsonText);
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if (
            item['@type'] === 'Product' ||
            item['@type'] === 'InsuranceAgency' ||
            item['@type'] === 'FinancialProduct' ||
            item['@type'] === 'Service'
          ) {
            const rawFields: Record<string, string | string[] | number | null> = {
              insurerName,
              category: this.category,
            };

            if (item.name) rawFields['productName'] = String(item.name);
            if (item.description) rawFields['description'] = String(item.description);
            if (item.offers?.price) rawFields['premium'] = String(item.offers.price);
            if (item.offers?.priceCurrency) rawFields['currency'] = String(item.offers.priceCurrency);

            products.push({
              rawName: String(item.name || 'Unknown Product'),
              rawFields,
              sourceUrl: url,
              extractionConfidence: 0.5,
              warnings: ['Extracted from JSON-LD structured data'],
            });
          }
        }
      } catch {
        // Invalid JSON — skip
      }
    });

    return products;
  }

  private extractFromRegex(
    $: cheerio.CheerioAPI,
    url: string,
    insurerName: string
  ): ExtractedProduct | null {
    const title = this.cleanText($('h1').first().text() || $('title').text() || '');
    if (!title) return null;

    const rawName = title.replace(/\s*[-|–].*$/, '').trim();
    if (!rawName || rawName.length < 3) return null;

    const bodyText = this.cleanText($('body').text());
    const rawFields = this.extractFieldsFromText(bodyText, insurerName);

    // Features from lists with relevant headings
    const features: string[] = [];
    const exclusions: string[] = [];
    const riders: string[] = [];

    $('ul, ol').each((_, list) => {
      const prev = $(list).prev('h2, h3, h4, p, strong, b').text().toLowerCase();

      const items: string[] = [];
      $(list).find('li').each((__, li) => {
        const t = this.cleanText($(li).text());
        if (t && t.length > 5 && t.length < 500) items.push(t);
      });

      if (/feature|benefit|inclusion|cover|advantage|highlight|what.*covered/i.test(prev)) {
        features.push(...items);
      } else if (/exclusion|not\s*cover|excluded|what.*not.*covered/i.test(prev)) {
        exclusions.push(...items);
      } else if (/rider|add-on|addon|optional\s*cover/i.test(prev)) {
        riders.push(...items);
      }
    });

    if (features.length > 0) rawFields['keyFeatures'] = features;
    if (exclusions.length > 0) rawFields['keyExclusions'] = exclusions;
    if (riders.length > 0) rawFields['riders'] = riders;

    const fieldCount = Object.keys(rawFields).length;
    if (fieldCount <= 2) return null;

    return {
      rawName,
      rawFields,
      sourceUrl: url,
      extractionConfidence: Math.min(0.2 + fieldCount * 0.04, 0.6),
      warnings: ['Generic regex extraction — low confidence, verify all fields'],
    };
  }

  /**
   * Extract common insurance fields from a block of text using regex patterns.
   */
  private extractFieldsFromText(
    text: string,
    insurerName: string
  ): Record<string, string | string[] | number | null> {
    const fields: Record<string, string | string[] | number | null> = {};
    fields['insurerName'] = insurerName;
    fields['category'] = this.category;

    // Sum insured
    const sumPatterns = [
      /sum\s*insured[:\s]*(?:up\s*to\s*)?(?:₹|rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i,
      /cover(?:age)?\s*(?:amount)?[:\s]*(?:up\s*to\s*)?(?:₹|rs\.?\s*)?([\d,.]+\s*(?:lakh|lac|crore|cr)\b)/i,
      /(?:₹|rs\.?\s*)([\d,.]+\s*(?:lakh|lac|crore|cr)\b)\s*(?:sum\s*insured|cover)/i,
    ];
    for (const p of sumPatterns) {
      const m = text.match(p);
      if (m) { fields['sumInsured'] = m[1]; break; }
    }

    // Premium
    const premPatterns = [
      /premium[:\s]*(?:starting\s*(?:from|at)\s*)?(?:₹|rs\.?\s*)?([\d,.]+)/i,
      /(?:starts?\s*(?:from|at)|starting)\s*(?:₹|rs\.?\s*)?([\d,.]+)/i,
      /(?:₹|rs\.?\s*)([\d,.]+)\s*(?:per\s*(?:month|year|annum))/i,
    ];
    for (const p of premPatterns) {
      const m = text.match(p);
      if (m) { fields['premium'] = m[0]; break; }
    }

    // Age / eligibility
    const agePatterns = [
      /(?:entry\s*)?age[:\s]*(\d+)\s*(?:-|to|–)\s*(\d+)\s*(?:year|yr)?s?/i,
      /eligib(?:le|ility)[:\s]*(\d+)\s*(?:-|to|–)\s*(\d+)/i,
      /min(?:imum)?\s*age[:\s]*(\d+)/i,
    ];
    for (const p of agePatterns) {
      const m = text.match(p);
      if (m) {
        fields['eligibilityAge'] = m[2]
          ? `${m[1]}-${m[2]} years`
          : `${m[1]} years`;
        break;
      }
    }

    // Waiting period
    const wpPatterns = [
      /initial\s*waiting\s*period[:\s]*([\d]+\s*(?:days?|months?|years?))/i,
      /waiting\s*period[:\s]*([\d]+\s*(?:days?|months?|years?))/i,
      /pre[- ]existing[:\s]*([\d]+\s*(?:days?|months?|years?))/i,
    ];
    for (const p of wpPatterns) {
      const m = text.match(p);
      if (m) { fields['waitingPeriod'] = m[1]; break; }
    }

    // Network hospitals
    const hospMatch = text.match(/(\d[\d,]+)\s*\+?\s*(?:network\s*)?hospital/i);
    if (hospMatch) fields['networkHospitals'] = hospMatch[1];

    // Claim settlement ratio
    const csrMatch = text.match(/claim\s*settlement\s*ratio[:\s]*([\d.]+)\s*%/i);
    if (csrMatch) fields['claimSettlementRatio'] = csrMatch[1];

    // Renewability
    const renewMatch = text.match(
      /renew(?:able|ability)[:\s]*(life\s*long|lifetime|up\s*to\s*\d+\s*years?|no\s*age\s*limit)/i
    );
    if (renewMatch) fields['renewability'] = renewMatch[1];

    // Policy tenure
    const tenureMatch = text.match(
      /policy\s*(?:term|tenure|period)[:\s]*([\d]+\s*(?:year|month)s?(?:\s*(?:to|-|–)\s*[\d]+\s*(?:year|month)s?)?)/i
    );
    if (tenureMatch) fields['policyTenure'] = tenureMatch[1];

    // Co-payment
    const copayMatch = text.match(/co[- ]?pay(?:ment)?[:\s]*([\d]+\s*%)/i);
    if (copayMatch) fields['copayment'] = copayMatch[1];

    // Room rent
    const roomMatch = text.match(
      /room\s*rent[:\s]*((?:single|shared|private|no\s*(?:cap|limit|restriction))[\w\s]*)/i
    );
    if (roomMatch) fields['roomRent'] = roomMatch[1];

    return fields;
  }
}
