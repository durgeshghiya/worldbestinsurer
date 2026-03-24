import * as cheerio from 'cheerio';
import type { Category } from '../../../src/lib/types';

export interface ExtractedProduct {
  rawName: string;
  rawFields: Record<string, string | string[] | number | null>;
  sourceUrl: string;
  extractionConfidence: number;
  warnings: string[];
}

export interface ExtractionResult {
  sourceId: string;
  insurerSlug: string;
  category: Category;
  timestamp: string;
  products: ExtractedProduct[];
  metadata: {
    extractionMethod: string;
    durationMs: number;
    warnings: string[];
  };
}

export abstract class BaseExtractor {
  abstract sourceId: string;
  abstract insurerSlug: string;
  abstract category: Category;

  abstract extract(html: string, url: string): Promise<ExtractionResult>;

  protected load(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  /**
   * Trim whitespace, collapse multiple spaces/newlines into single space,
   * and strip zero-width characters.
   */
  protected cleanText(text: string): string {
    return text
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract rows from an HTML table. Each row becomes a Record mapping
   * header text to cell text. If the table has no <thead>, the first <tr>
   * is treated as the header row.
   */
  protected extractTable(
    $: cheerio.CheerioAPI,
    selector: string
  ): Record<string, string>[] {
    const table = $(selector).first();
    if (!table.length) return [];

    const headers: string[] = [];
    const rows: Record<string, string>[] = [];

    // Try thead > tr > th first
    const theadCells = table.find('thead tr th, thead tr td');
    if (theadCells.length > 0) {
      theadCells.each((_, el) => {
        headers.push(this.cleanText($(el).text()));
      });
    }

    const bodyRows = table.find('tbody tr');
    const allRows = bodyRows.length > 0 ? bodyRows : table.find('tr');

    allRows.each((i, row) => {
      const cells: string[] = [];
      $(row)
        .find('td, th')
        .each((_, cell) => {
          cells.push(this.cleanText($(cell).text()));
        });

      // If no headers yet, treat first row as header
      if (headers.length === 0 && i === 0) {
        headers.push(...cells);
        return;
      }

      if (cells.length > 0) {
        const record: Record<string, string> = {};
        headers.forEach((h, idx) => {
          if (idx < cells.length) {
            record[h] = cells[idx];
          }
        });
        rows.push(record);
      }
    });

    return rows;
  }

  /**
   * Extract text items from a list (ul/ol) matching the selector.
   */
  protected extractList(
    $: cheerio.CheerioAPI,
    selector: string
  ): string[] {
    const items: string[] = [];
    $(selector)
      .find('li')
      .each((_, el) => {
        const text = this.cleanText($(el).text());
        if (text) items.push(text);
      });
    return items;
  }

  /**
   * Parse Indian currency strings into numeric values.
   * Handles: "5 Lakh" -> 500000, "1 Crore" -> 10000000,
   * "₹10,000" -> 10000, "Rs. 25,00,000" -> 2500000,
   * "50L" -> 5000000, "2Cr" -> 20000000, "10 lakhs" -> 1000000
   */
  protected parseCurrency(text: string): number | null {
    if (!text || typeof text !== 'string') return null;

    const cleaned = text
      .replace(/[₹,Rs.\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Match number + qualifier (lakh/crore)
    const croreMatch = cleaned.match(
      /(\d+(?:\.\d+)?)\s*(?:crore|cr)\b/i
    );
    if (croreMatch) {
      return parseFloat(croreMatch[1]) * 10_000_000;
    }

    const lakhMatch = cleaned.match(
      /(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/i
    );
    if (lakhMatch) {
      return parseFloat(lakhMatch[1]) * 100_000;
    }

    // Try plain number (possibly with Indian formatting like 25,00,000)
    const plainMatch = cleaned.match(/(\d[\d,]*(?:\.\d+)?)/);
    if (plainMatch) {
      const num = parseFloat(plainMatch[1].replace(/,/g, ''));
      if (!isNaN(num)) return num;
    }

    return null;
  }

  /**
   * Parse age range strings.
   * "18-65 years" -> {min:18, max:65}
   * "18 to 65" -> {min:18, max:65}
   * "Min 18 years" -> {min:18, max:null}
   * "above 18" -> {min:18, max:null}
   * "up to 65 years" -> {min:0, max:65}
   */
  protected parseAge(
    text: string
  ): { min: number; max: number | null } | null {
    if (!text || typeof text !== 'string') return null;

    const cleaned = text.replace(/years?|yrs?/gi, '').trim();

    // Range: "18-65", "18 - 65", "18 to 65"
    const rangeMatch = cleaned.match(/(\d+)\s*(?:-|to|–)\s*(\d+)/i);
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1], 10),
        max: parseInt(rangeMatch[2], 10),
      };
    }

    // "Min 18" or "minimum 18" or "above 18" or "from 18"
    const minMatch = cleaned.match(
      /(?:min(?:imum)?|above|from|at least)\s*(\d+)/i
    );
    if (minMatch) {
      return { min: parseInt(minMatch[1], 10), max: null };
    }

    // "up to 65" or "max 65" or "below 65"
    const maxMatch = cleaned.match(
      /(?:up\s*to|max(?:imum)?|below|under)\s*(\d+)/i
    );
    if (maxMatch) {
      return { min: 0, max: parseInt(maxMatch[1], 10) };
    }

    // Single number
    const singleMatch = cleaned.match(/^(\d+)$/);
    if (singleMatch) {
      return { min: parseInt(singleMatch[1], 10), max: null };
    }

    return null;
  }

  /**
   * Create a timed ExtractionResult wrapper around the actual extraction logic.
   */
  protected async timedExtract(
    url: string,
    extractionMethod: string,
    extractFn: () => Promise<{ products: ExtractedProduct[]; warnings: string[] }>
  ): Promise<ExtractionResult> {
    const start = Date.now();
    const { products, warnings } = await extractFn();
    const durationMs = Date.now() - start;

    return {
      sourceId: this.sourceId,
      insurerSlug: this.insurerSlug,
      category: this.category,
      timestamp: new Date().toISOString(),
      products,
      metadata: {
        extractionMethod,
        durationMs,
        warnings,
      },
    };
  }
}
