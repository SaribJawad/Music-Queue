interface ButtonProps {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

function Button({
  children,
  size = "md",
  className = "",
  onClick,
  type,
}: ButtonProps) {
  const baseStyles =
    "border rounded-md border-text_dark_secondary  hover:border-text_light hover:dark:bg-text_dark bg-text_dark_secondary  hover:bg-background_light hover:rounded-none  hover:dark:text-black  hover:text-text_light text-white transition-all duration-300 ";
  const sizeStyles = {
    sm: "sm:px-2 px-1 py-1  sm:text-sm text-xs",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={` ${baseStyles} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
