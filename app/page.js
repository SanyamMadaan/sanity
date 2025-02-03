import HeroSection from "../components/HeroSection";
import { Dashboard } from "../components/Dash";
import FeatureSection from "../components/FeatureSection/FeatureSection";
import FaqSection from "../components/FaqSection";
import { SparklesLanding } from "../@/components/ui/bg-stars";

export default async function Home() {
  return (
    <main className="relative">
      {/* Background */}
      <SparklesLanding />
      {/* Landing Page */}
      <div className="relative z-10">
        <HeroSection />
        <Dashboard />
        <div id="feature-section">
          <FeatureSection />
        </div>
        <div id="faq-section">
          <FaqSection />
        </div>
      </div>
    </main>
  );
}
