import { useEffect, useState } from "react";
import { IoMoonSharp } from "react-icons/io5";
import { FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1  rounded-lg transition-colors bg-background_light_secondary dark:bg-gray-800"
    >
      {theme === "dark" ? (
        <FiSun className="text-yellow-500" size={22} />
      ) : (
        <IoMoonSharp className="text-gray-900" size={22} />
      )}
    </button>
  );
}
