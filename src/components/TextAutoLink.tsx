import React from "react";
import Link from "next/link";

const DICTIONARY = [
  { match: /(claim settlement ratio)/i, url: "/learn/what-to-check-before-buying-term-insurance" },
  { match: /(waiting period)/i, url: "/learn/how-waiting-periods-work" },
  { match: /(pre-existing disease)/i, url: "/learn/how-waiting-periods-work" },
  { match: /(pre-existing conditions)/i, url: "/learn/how-waiting-periods-work" },
  { match: /(no-claim bonus)/i, url: "/tools/no-claim-bonus-calculator" },
  { match: /(depreciation schedule)/i, url: "/learn/understanding-motor-insurance-india" },
  { match: /(third-party liability)/i, url: "/learn/understanding-motor-insurance-india" },
  { match: /(tax deduction)/i, url: "/learn/health-insurance-tax-benefits-80d" },
];

export default function TextAutoLink({ children }: { children: string }) {
  if (typeof children !== "string") return <>{children}</>;

  let elements: React.ReactNode[] = [children];

  for (const entry of DICTIONARY) {
    const newElements: React.ReactNode[] = [];
    for (const el of elements) {
      if (typeof el === "string") {
        // Since we use a capturing group, split includes the matched text as alternating elements.
        const parts = el.split(entry.match);
        parts.forEach((part, i) => {
          // The matched text is at odd indices
          if (i % 2 === 1) {
            newElements.push(
              <Link
                key={`${entry.url}-${i}`}
                href={entry.url}
                className="text-primary hover:underline underline-offset-2"
                title={`Learn more about ${part.toLowerCase()}`}
              >
                {part}
              </Link>
            );
          } else if (part) {
            newElements.push(part);
          }
        });
      } else {
        newElements.push(el);
      }
    }
    elements = newElements;
  }

  return <>{elements.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}</>;
}
