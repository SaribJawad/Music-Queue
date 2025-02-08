function Button({ children }: { children: string }) {
  return (
    <button className="px-6 py-3 dark:text-white text-text_light border border-purple-500 hover:bg-text_light hover:text-text_dark  dark:hover:bg-purple-700 duration-300 transition-all rounded-md text-sm w-fit self-center">
      {children}
    </button>
  );
}

export default Button;
