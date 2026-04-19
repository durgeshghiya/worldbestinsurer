import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ZuraChat from "@/components/ZuraChat";
import ScrollProgress from "@/components/ScrollProgress";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import "./globals.css";

// Existing shell (non-homepage pages still use these)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial typography for the new marketing design — adopted on the homepage
// first; will cascade to more surfaces as the design system rolls out.
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
const interTight = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://worldbestinsurer.com"),
  title: {
    default: "World Best Insurer — Compare Insurance Plans Globally",
    template: "%s | World Best Insurer",
  },
  description:
    "The world's insurance comparison platform. Compare health, term life, motor, and travel insurance plans across top insurers. Verified data, transparent methodology.",
  keywords: [
    "insurance comparison global",
    "compare health insurance",
    "term insurance comparison",
    "motor insurance India",
    "travel insurance compare",
    "best health insurance plans",
    "insurance plans comparison",
    "health insurance premium calculator",
    "term life insurance India",
    "car insurance comparison",
    "bike insurance compare",
    "travel insurance for Indians",
    "insurance policy comparison tool",
    "global insurance comparison",
    "claim settlement ratio India",
    "cashless health insurance",
    "family floater health insurance",
    "World Best Insurer",
  ],
  openGraph: {
    title: "World Best Insurer — Compare Insurance Plans Globally",
    description:
      "Compare health, term life, motor, and travel insurance across India's leading insurers. Transparent, verified, educational.",
    type: "website",
    locale: "en",
    siteName: "World Best Insurer",
    url: "https://worldbestinsurer.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Best Insurer — Compare Insurance Plans Globally",
    description:
      "Compare health, term life, motor, and travel insurance across India's leading insurers.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://worldbestinsurer.com",
    languages: {
      "en": "https://worldbestinsurer.com",
      "en-IN": "https://worldbestinsurer.com/in/",
      "en-US": "https://worldbestinsurer.com/us/",
      "en-GB": "https://worldbestinsurer.com/uk/",
      "en-AE": "https://worldbestinsurer.com/ae/",
      "en-SG": "https://worldbestinsurer.com/sg/",
      "en-CA": "https://worldbestinsurer.com/ca/",
      "en-AU": "https://worldbestinsurer.com/au/",
      "de-DE": "https://worldbestinsurer.com/de/",
      "en-SA": "https://worldbestinsurer.com/sa/",
      "ja-JP": "https://worldbestinsurer.com/jp/",
      "ko-KR": "https://worldbestinsurer.com/kr/",
      "en-HK": "https://worldbestinsurer.com/hk/",
    },
  },
  other: {
    "theme-color": "#6366f1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#6366f1" />
        <link rel="alternate" hrefLang="en" href="https://worldbestinsurer.com" />
        {/* Google Consent Mode v2 — denied by default in EEA/UK/CH, granted elsewhere.
            Funding Choices CMP (loaded below) shows a banner in regulated regions and
            calls gtag('consent','update',...) once the user responds. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500,region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','IS','LI','NO','CH']});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);gtag('js',new Date());gtag('config','G-PGW5QZ146V');`,
          }}
        />
        {/* Funding Choices — Google's certified CMP. Shows GDPR consent banner in
            EEA/UK/CH automatically; does nothing elsewhere. ers=1 defers ads until
            consent is known. Requires a published GDPR message in AdSense console. */}
        <script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-4984848270074853?ers=1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function s(){if(!window.frames.googlefcPresent){if(document.body){var f=document.createElement('iframe');f.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px';f.style.display='none';f.name='googlefcPresent';document.body.appendChild(f);}else{setTimeout(s,0);}}}s();})();`,
          }}
        />
        {/* Defer AdSense + GA4 network fetches until after load — improves LCP.
            Consent Mode governs whether either actually reads/writes cookies. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load',function(){setTimeout(function(){var a=document.createElement('script');a.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4984848270074853';a.async=true;a.crossOrigin='anonymous';document.head.appendChild(a);var g=document.createElement('script');g.src='https://www.googletagmanager.com/gtag/js?id=G-PGW5QZ146V';g.async=true;document.head.appendChild(g);},2000)});`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <OrganizationSchema />
        <WebsiteSchema />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ZuraChat />
      </body>
    </html>
  );
}
