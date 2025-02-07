import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

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
      className="p-1 rounded-lg transition-colors bg-purple-200 dark:bg-gray-800"
    >
      {theme === "dark" ? (
        <Sun className="text-yellow-500" size={22} />
      ) : (
        <Moon className="text-gray-900" size={22} />
      )}
    </button>
  );
}
