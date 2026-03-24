import type { MetadataRoute } from "next";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import {
  generateVSPairs,
  generateCityParams,
  getArticles,
} from "@/lib/generators";

const BASE_URL = "https://worldbestinsurer.com";

/**
 * Generate multiple sitemaps to stay well under Google's 50,000 URL limit per sitemap.
 * Split by page type: core, products, insurers, vs, city, learn.
 */
export async function generateSitemaps() {
  return [
    { id: "core" },
    { id: "products" },
    { id: "insurers" },
    { id: "vs" },
    { id: "city-0" },
    { id: "city-1" },
    { id: "learn" },
  ];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  switch (id) {
    case "core":
      return buildCoreSitemap();
    case "products":
      return buildProductsSitemap();
    case "insurers":
      return buildInsurersSitemap();
    case "vs":
      return buildVSSitemap();
    case "city-0":
      return buildCitySitemap(0);
    case "city-1":
      return buildCitySitemap(1);
    case "learn":
      return buildLearnSitemap();
    default:
      return [];
  }
}

function buildCoreSitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const urls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Category comparison pages
  const categories = ["health", "term-life", "motor", "travel"];
  for (const cat of categories) {
    urls.push({
      url: `${BASE_URL}/compare/${cat}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Static pages
  const staticPages = [
    "about",
    "contact",
    "methodology",
    "disclaimer",
    "waitlist",
    "insurers",
    "learn",
  ];
  for (const page of staticPages) {
    urls.push({
      url: `${BASE_URL}/${page}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return urls;
}

function buildProductsSitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const now = new Date();

  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.lastVerified ? new Date(product.lastVerified) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}

function buildInsurersSitemap(): MetadataRoute.Sitemap {
  const insurers = getAllInsurers();
  const now = new Date();

  return insurers.map((insurer) => ({
    url: `${BASE_URL}/insurer/${insurer.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

function buildVSSitemap(): MetadataRoute.Sitemap {
  const pairs = generateVSPairs();
  const now = new Date();

  return pairs.map((pair) => ({
    url: `${BASE_URL}/vs/${pair.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

function buildCitySitemap(chunk: number): MetadataRoute.Sitemap {
  const allParams = generateCityParams();
  const now = new Date();

  // Split city pages into two chunks
  const midpoint = Math.ceil(allParams.length / 2);
  const start = chunk === 0 ? 0 : midpoint;
  const end = chunk === 0 ? midpoint : allParams.length;
  const params = allParams.slice(start, end);

  return params.map((p) => ({
    url: `${BASE_URL}/compare/${p.category}/in/${p.city}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

function buildLearnSitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const now = new Date();

  return articles.map((article) => ({
    url: `${BASE_URL}/learn/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
