import { useEffect } from "react";

function LoadingBar({ size = "lg" }: { size?: "sm" | "lg" | "xs" }) {
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return <span className={`loading loading-spinner loading-${size}`}></span>;
}

export default LoadingBar;
