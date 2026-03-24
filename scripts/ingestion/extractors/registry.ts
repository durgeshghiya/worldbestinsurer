import { BaseExtractor } from './base-extractor';
import { StarHealthExtractor } from './star-health';
import { CareHealthExtractor } from './care-health';
import { NivaBupaExtractor } from './niva-bupa';
import { HdfcErgoExtractor } from './hdfc-ergo';
import { GenericExtractor } from './generic-extractor';

/**
 * Registry of all known extractors, keyed by sourceId.
 * Provides lookup by sourceId and enumeration of all registered extractors.
 */

const extractorInstances: Map<string, BaseExtractor> = new Map();

function ensureInitialized(): void {
  if (extractorInstances.size > 0) return;

  const extractors: BaseExtractor[] = [
    new StarHealthExtractor(),
    new CareHealthExtractor(),
    new NivaBupaExtractor(),
    new HdfcErgoExtractor(),
  ];

  for (const ext of extractors) {
    extractorInstances.set(ext.sourceId, ext);
  }
}

/**
 * Get a specific extractor by sourceId.
 * Returns null if no extractor is registered for the given ID.
 * Falls back to GenericExtractor if 'generic' is requested.
 */
export function getExtractor(sourceId: string): BaseExtractor | null {
  ensureInitialized();

  if (sourceId === 'generic') {
    return new GenericExtractor();
  }

  return extractorInstances.get(sourceId) ?? null;
}

/**
 * Get all registered extractors (excluding the generic fallback).
 */
export function getAllExtractors(): BaseExtractor[] {
  ensureInitialized();
  return Array.from(extractorInstances.values());
}

/**
 * Get an extractor for a given sourceId. If no specific extractor is found,
 * returns a GenericExtractor with the insurerSlug and category pre-configured.
 */
export function getExtractorOrFallback(
  sourceId: string,
  fallbackSlug: string,
  fallbackCategory: 'health' | 'term-life' | 'motor' | 'travel'
): BaseExtractor {
  ensureInitialized();

  const specific = extractorInstances.get(sourceId);
  if (specific) return specific;

  const generic = new GenericExtractor();
  generic.setContext(fallbackSlug, fallbackCategory);
  return generic;
}

/**
 * List all registered sourceIds.
 */
export function getRegisteredSourceIds(): string[] {
  ensureInitialized();
  return Array.from(extractorInstances.keys());
}
