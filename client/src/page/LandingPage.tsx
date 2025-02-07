import Navbar from "../component/Navbar";
import HeroSection from "../component/ui/HeroSection";

function LandingPage() {
  return (
    <div className="h-dvh w-full bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark ">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}

export default LandingPage;
