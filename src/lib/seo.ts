import { getActiveCountries } from "./countries";

export const SITE_URL = "https://worldbestinsurer.com";

/**
 * Builds the hreflang dictionary for Next.js metadata alternates.languages.
 * 
 * @param pathBuilder A function that takes a country code and returns the local path. 
 *                    If it returns null, that country is skipped.
 * @param fallbackPath The x-default path (e.g. global hub).
 */
export function buildHreflang(
  pathBuilder: (countryCode: string) => string | null,
  fallbackPath?: string
): Record<string, string> {
  const activeCountries = getActiveCountries();
  const languages: Record<string, string> = {};

  for (const country of activeCountries) {
    const localPath = pathBuilder(country.code);
    if (localPath) {
      // e.g. "en-IN": "https://worldbestinsurer.com/in/compare/health"
      languages[country.locale] = `${SITE_URL}${localPath.startsWith('/') ? '' : '/'}${localPath}`;
    }
  }

  if (fallbackPath) {
    languages["x-default"] = `${SITE_URL}${fallbackPath.startsWith('/') ? '' : '/'}${fallbackPath}`;
  }

  return languages;
}
