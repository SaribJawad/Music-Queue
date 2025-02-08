import ThemeToggle from "./ui/ThemeToggle";

function Navbar() {
  return (
    <nav className="py-4 px-6 flex items-center justify-between lg:w-[80%] w-full lg:mx-auto  ">
      <h1 className="text-xl font-semibold text-text_light dark:text-text_dark">
        Music Queue
      </h1>
      <ul className=" items-center gap-10 justify-center sm:flex hidden">
        <li className="cursor-pointer text-text_light dark:text-white dark:hover:text-purple-300">
          Features
        </li>
        <li className="cursor-pointer text-text_light dark:text-white  dark:hover:text-purple-300 ">
          How it works
        </li>
      </ul>
      <ThemeToggle />
    </nav>
  );
}

export default Navbar;
