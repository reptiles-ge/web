import { AIUploadPreview } from "@/components/AIUploadPreview";
import { FeatureSection } from "@/components/FeatureSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { SpeciesCarousel } from "@/components/SpeciesCarousel";
import { SpeciesDetail } from "@/components/SpeciesDetail";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  logo: absoluteUrl("/images/logo.png"),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[websiteJsonLd, organizationJsonLd]} />
      <Navbar />
      <main>
        <Hero />
        <SpeciesCarousel />
        <SpeciesDetail />
        <FeatureSection />
        <AIUploadPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
