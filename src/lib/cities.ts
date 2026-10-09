import fs from "fs";
import path from "path";

export interface City {
  slug: string;
  name: string;
  state: string;
  tier: number;
}

let citiesCache: City[] | null = null;

export function getIndianCities(): City[] {
  if (citiesCache) return citiesCache;
  try {
    const filePath = path.join(process.cwd(), "src", "data", "indian-cities.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    citiesCache = data.cities || [];
    return citiesCache!;
  } catch (e) {
    console.error("Failed to load indian cities", e);
    return [];
  }
}

export function getCityBySlug(slug: string): City | undefined {
  return getIndianCities().find(c => c.slug === slug);
}
