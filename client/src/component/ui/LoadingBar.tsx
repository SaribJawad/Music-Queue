function LoadingBar({ size = "lg" }: { size?: "sm" | "lg" }) {
  return <span className={`loading loading-spinner loading-${size}`}></span>;
}

export default LoadingBar;
