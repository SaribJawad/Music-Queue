function Button({
  children,
  size = "md",
  onClick,
}: {
  children: React.ReactNode;
  size?: string;
  onClick?: (...args: any[]) => any;
}) {
  return (
    <button
      onClick={onClick ? onClick : undefined}
      className={`${
        size === "sm" ? "px-4 py-1" : "px-6 py-3"
      } dark:text-white text-text_light border border-purple-500 hover:bg-text_light hover:text-text_dark  dark:hover:bg-purple-700 duration-300 transition-all rounded-md text-sm w-fit self-center flex items-center gap-2`}
    >
      {children}
    </button>
  );
}

export default Button;
