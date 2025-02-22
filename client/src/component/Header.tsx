import { useEffect, useState } from "react";
import ThemeToggle from "./ui/ThemeToggle";

function Header() {
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "how-it-works"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="py-4 px-6 flex items-center justify-between lg:w-[80%] w-full lg:mx-auto">
      <h1 className="text-xl font-semibold text-text_light dark:text-text_dark">
        Music Queue
      </h1>
      <ul className="items-center gap-10 justify-center sm:flex hidden dark:text-white text-text_light">
        <li
          onClick={() => scrollToSection("features")}
          className="cursor-pointer"
        >
          Features
        </li>
        <li
          onClick={() => scrollToSection("how-it-works")}
          className="cursor-pointer "
        >
          How it works
        </li>
      </ul>
      <ThemeToggle />
    </nav>
  );
}

export default Header;
