import Hero from "@/components/ui/Hero";
import StatsSection from "@/components/ui/StatsSection"; // Using AdminStats data
import FeaturedGrid from "@/components/ui/FeaturedGrid";
import AIChatPreview from "@/components/ui/AIChatPreview";
import CategoryExplorer from "@/components/ui/CategoryExplorer";
import HowItWorks from "@/components/ui/HowItWorks";
import Testimonials from "@/components/ui/Testimonials";
import Newsletter from "@/components/ui/Newsletter";
import TravelInsights from "@/components/ui/TravelInsights";
import Partners from "@/components/ui/Partners";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* 1. Hero Section (70vh height) */}
      <Hero />

      {/* 2. Trust Stats (From your admin.controller.ts) */}
      <StatsSection />

      {/* 3. Category Quick Filter */}
      <CategoryExplorer />

      {/* 4. Featured Destinations (Searchable Grid) */}
      <FeaturedGrid />

      {/* 5. AI Assistant Promotion */}
      <AIChatPreview />

      {/* 6. How it Works (Interactive UI) */}
      <HowItWorks />

      {/* 7. AI Travel Insights */}
      <TravelInsights />

      {/* 8. Partner Networks */}
      <Partners />

      {/* 9. Global User Reviews */}
      <Testimonials />

      {/* 10. Modern Newsletter CTA */}
      <Newsletter />
    </div>
  );
}
