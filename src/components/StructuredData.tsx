import type React from "react";
import type { InsuranceProduct, Insurer } from "@/lib/types";
import type { Article } from "@/lib/generators";
import { getCountryByCode } from "@/lib/countries";
import type { GeoData } from "@/lib/geo";

const BASE_URL = "https://worldbestinsurer.com";

/**
 * Serialise JSON-LD safely. `<` is escaped so a value scraped from an external
 * page cannot close the script tag; `\u003c` is valid JSON and parses back to
 * the same string.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
          .replace(/</g, "\\u003c")
          .replace(/\u2028/g, "\\u2028")
          .replace(/\u2029/g, "\\u2029"),
      }}
    />
  );
}

export function OrganizationSchema(): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "World Best Insurer",
        legalName: "World Best Insurer Global",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.svg`,
          width: 512,
          height: 512,
        },
        description:
          "The world's insurance comparison and regulatory intelligence platform. Compare health, term life, motor, and travel insurance plans with verified statutory data across 12 countries.",
        slogan: "Compare Insurance Plans Globally with Verified Regulatory Data",
        publishingPrinciples: `${BASE_URL}/methodology/`,
        knowsAbout: [
          "Health Insurance",
          "Term Life Insurance",
          "Motor Insurance",
          "Travel Insurance",
          "Claim Settlement Ratio (CSR)",
          "Incurred Claim Ratio (ICR)",
          "IRDAI Guidelines",
          "Cashless Hospital Networks",
          "Insurance Ombudsman Redressal",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${BASE_URL}/contact`,
          availableLanguage: ["English", "Hindi", "German", "Japanese", "Korean", "Arabic"],
        },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Singapore" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Australia" },
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "Saudi Arabia" },
          { "@type": "Country", name: "Japan" },
          { "@type": "Country", name: "South Korea" },
          { "@type": "Country", name: "Hong Kong" },
        ],
      }}
    />
  );
}

export function WebsiteSchema(): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "World Best Insurer",
        url: BASE_URL,
        description:
          "Compare insurance plans across 12 countries worldwide. Transparent, verified, statutory regulatory data.",
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/compare/{search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: ["en", "en-IN", "en-US", "en-GB", "de-DE", "ja-JP", "ko-KR", "en-AE"],
      }}
    />
  );
}

export function InsurerSchema({
  insurer,
  countryCode,
  irdaiRegNo,
}: {
  insurer: Insurer;
  countryCode: string;
  irdaiRegNo?: string;
}): React.ReactNode {
  const c = getCountryByCode(countryCode);
  const canonicalUrl = `${BASE_URL}/${countryCode}/insurer/${insurer.slug}/`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["FinancialService", "InsuranceAgency"],
        "@id": `${canonicalUrl}#insurer`,
        name: insurer.name,
        alternateName: insurer.shortName || undefined,
        description: insurer.description || `${insurer.name} is a licensed insurer in ${c?.name || "India"}.`,
        url: canonicalUrl,
        sameAs: insurer.website ? [insurer.website] : [],
        telephone: insurer.contact?.phone || undefined,
        email: insurer.contact?.email || undefined,
        areaServed: {
          "@type": "Country",
          name: c?.name || "India",
        },
        ...(irdaiRegNo && {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "IRDAI Registration Number",
            value: irdaiRegNo,
          },
        }),
        ...(insurer.claimSettlementRatio?.value != null && {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Claim Settlement Ratio",
              value: `${insurer.claimSettlementRatio.value}%`,
              description: `Statutory Claim Settlement Ratio for ${insurer.claimSettlementRatio.year || "latest period"}.`,
            },
            ...(insurer.networkHospitals
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "Cashless Network Hospitals",
                    value: `${insurer.networkHospitals}+`,
                  },
                ]
              : []),
          ],
        }),
      }}
    />
  );
}

export function HospitalNetworkSchema({
  insurer,
  cityName,
  stateName,
  geo,
}: {
  insurer: Insurer;
  cityName: string;
  stateName: string;
  geo?: GeoData;
}): React.ReactNode {
  const pageUrl = `${BASE_URL}/in/insurer/${insurer.slug}/hospitals/${geo?.cityName.toLowerCase().replace(/\s+/g, "-") || cityName.toLowerCase()}/`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["MedicalOrganization", "LocalBusiness"],
        "@id": `${pageUrl}#hospital-network`,
        name: `${insurer.name} Cashless Hospital Network — ${cityName}`,
        description: `Comprehensive directory and claims facilitation guide for ${insurer.name} network hospitals offering cashless treatments in ${cityName}, ${stateName}.`,
        url: pageUrl,
        telephone: insurer.contact?.phone || undefined,
        paymentAccepted: "Cashless health insurance pre-authorization, TPA direct billing",
        currenciesAccepted: "INR",
        areaServed: {
          "@type": "AdministrativeArea",
          name: cityName,
          containedInPlace: {
            "@type": "State",
            name: stateName,
          },
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: cityName,
          addressRegion: stateName,
          addressCountry: "IN",
        },
        ...(geo && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }),
        parentOrganization: {
          "@type": "FinancialService",
          name: insurer.name,
          url: `${BASE_URL}/in/insurer/${insurer.slug}/`,
        },
      }}
    />
  );
}

export function VSPairSchema({
  title,
  description,
  url,
  itemA,
  itemB,
}: {
  title: string;
  description: string;
  url: string;
  itemA: { name: string; brand?: string; url?: string };
  itemB: { name: string; brand?: string; url?: string };
}): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemPage",
        name: title,
        description: description,
        url: url,
        mainEntity: {
          "@type": "ItemList",
          name: title,
          numberOfItems: 2,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: itemA.name,
              item: {
                "@type": "Product",
                name: itemA.name,
                brand: itemA.brand ? { "@type": "Brand", name: itemA.brand } : undefined,
                url: itemA.url,
              },
            },
            {
              "@type": "ListItem",
              position: 2,
              name: itemB.name,
              item: {
                "@type": "Product",
                name: itemB.name,
                brand: itemB.brand ? { "@type": "Brand", name: itemB.brand } : undefined,
                url: itemB.url,
              },
            },
          ],
        },
      }}
    />
  );
}

export function DatasetSchema({
  name,
  description,
  url,
  temporalCoverage,
  spatialCoverage,
}: {
  name: string;
  description: string;
  url: string;
  temporalCoverage?: string;
  spatialCoverage?: string;
}): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name,
        description,
        url,
        creator: {
          "@id": `${BASE_URL}/#organization`,
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
        temporalCoverage: temporalCoverage || "2024-2026",
        spatialCoverage: spatialCoverage || "IN",
        isAccessibleForFree: true,
      }}
    />
  );
}

export function ProductSchema({
  product,
  uin,
}: {
  product: InsuranceProduct;
  /** IRDAI UIN, when the registry has one verified for this product. */
  uin?: string;
}): React.ReactNode {
  const categoryLabels: Record<string, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };

  const country = getCountryByCode(product.countryCode);
  const currencyCode = country?.currency.code ?? "INR";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.productName,
        description: `${product.productName} by ${product.insurerName}. ${product.specialFeatures.slice(0, 3).join(". ")}.`,
        brand: {
          "@type": "Brand",
          name: product.insurerName,
        },
        category: categoryLabels[product.category] ?? product.category,
        url: `${BASE_URL}/${product.countryCode}/product/${product.id}/`,
        ...(uin && {
          productID: uin,
          identifier: { "@type": "PropertyValue", propertyID: "IRDAI UIN", value: uin },
        }),
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: currencyCode,
          lowPrice: product.premiumRange.illustrativeMin,
          highPrice: product.premiumRange.illustrativeMax,
          offerCount: 1,
          availability: "https://schema.org/InStock",
          description: `Illustrative annual premium. ${product.premiumRange.assumptions}`,
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Sum Insured Range",
            value: `${product.sumInsured.min ?? "N/A"} - ${product.sumInsured.max ?? "N/A"}`,
          },
          {
            "@type": "PropertyValue",
            name: "Confidence Score",
            value: product.confidenceScore,
          },
          {
            "@type": "PropertyValue",
            name: "Last Verified",
            value: product.lastVerified,
          },
        ],
      }}
    />
  );
}

export function ArticleSchema({
  article,
}: {
  article: Article;
}): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        url: `${BASE_URL}/learn/${article.slug}/`,
        author: {
          "@type": "Organization",
          name: "World Best Insurer Editorial Team",
          url: `${BASE_URL}/about/`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/learn/${article.slug}/`,
        },
        articleSection: article.category,
        inLanguage: "en",
      }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function FAQSchema({
  questions,
}: {
  questions: { q: string; a: string }[];
}): React.ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      }}
    />
  );
}

export function ComparisonSchema({
  products,
  category,
}: {
  products: InsuranceProduct[];
  category: string;
}): React.ReactNode {
  const categoryLabels: Record<string, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Compare Insurance Plans Globally`,
        description: `Side-by-side comparison of ${products.length} ${categoryLabels[category] ?? category} plans from leading global insurers.`,
        url: `${BASE_URL}/compare/${category}`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.productName,
          url: `${BASE_URL}/product/${product.id}`,
          item: {
            "@type": "Product",
            name: product.productName,
            brand: {
              "@type": "Brand",
              name: product.insurerName,
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "INR",
              lowPrice: product.premiumRange.illustrativeMin,
              highPrice: product.premiumRange.illustrativeMax,
            },
          },
        })),
      }}
    />
  );
}
