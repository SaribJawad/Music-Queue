import ThemeToggle from "./ThemeToggle";

function LoadingBar({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <>
      <span className={`loading loading-spinner loading-${size}`}></span>
      <div className="hidden">
        <ThemeToggle />
      </div>
    </>
  );
}

export default LoadingBar;
