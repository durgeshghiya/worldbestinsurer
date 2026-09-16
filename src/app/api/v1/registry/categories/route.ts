import { handler } from "../_lib/http";
import { PRODUCT_TYPE_LABEL, SEGMENT_LABEL, siteCategoryFor, type InsuranceSegment, type ProductType } from "@/lib/registry";

/** GET /api/v1/registry/categories — segments and product types with counts. */
export const GET = handler(({ reg }) => {
  const segments = (Object.keys(SEGMENT_LABEL) as InsuranceSegment[]).map((s) => ({
    segment: s,
    label: SEGMENT_LABEL[s],
    insurers: reg.insurers.filter((i) => i.segments.includes(s)).length,
    products: reg.products.filter((p) => p.segment === s).length,
  }));
  const productTypes = (Object.keys(PRODUCT_TYPE_LABEL) as ProductType[]).map((t) => ({
    productType: t,
    label: PRODUCT_TYPE_LABEL[t],
    products: reg.products.filter((p) => p.productType === t).length,
    comparisonHub: siteCategoryFor(t) ? `https://worldbestinsurer.com/in/compare/${siteCategoryFor(t)}/` : null,
  }));
  return { segments, productTypes };
});
