import { AIUploadPreview } from "@/components/AIUploadPreview";
import { FeatureSection } from "@/components/FeatureSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SpeciesCarousel } from "@/components/SpeciesCarousel";
import { SpeciesDetail } from "@/components/SpeciesDetail";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
