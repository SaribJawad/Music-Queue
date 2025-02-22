function LoadingBar({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <span className={`loading loading-spinner loading-${size}`}></span>;
    </div>
  );
}

export default LoadingBar;
