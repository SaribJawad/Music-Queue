import Footer from "../component/Footer";
import Header from "../component/Header";
import CTA from "../component/ui/CTA";
import FeatureSection from "../component/ui/FeatureSection";
import HeroSection from "../component/ui/HeroSection";
import HowItWorks from "../component/ui/HowItWorks";

function LandingPage() {
  return (
    <div className="h-dvh w-full bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark ">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
