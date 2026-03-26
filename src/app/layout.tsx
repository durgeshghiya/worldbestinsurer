import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#6366f1" />
        <link rel="alternate" hrefLang="en" href="https://worldbestinsurer.com" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4984848270074853" crossOrigin="anonymous" />
        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PGW5QZ146V" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PGW5QZ146V');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
