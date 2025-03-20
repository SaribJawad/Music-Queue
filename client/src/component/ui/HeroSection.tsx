import { Link } from "react-router-dom";
import Button from "../Button";
import { useAppSelector } from "../../app/hook";
import { selectIsAuthenticated } from "../../features/auth/auth.slice";

function HeroSection() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <section className="min-h-[calc(100vh-3.9rem)] w-full sm:w-[80%] py-10 px-3 sm:mx-auto flex flex-col items-center justify-center text-center gap-10 ">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold flex  flex-col gap-2">
          Stream, Vote, Play –{" "}
          <span className="keyboard block px-3  rounded-md text-text_dark_secondary">
            <span className="key">Y</span>
            <span className="key">O</span>
            <span className="key">U</span>
            <span className="key">R</span> <span className="key">M</span>
            <span className="key">U</span>
            <span className="key">S</span>
            <span className="key">I</span>
            <span className="key">C,</span>
          </span>
          Your Rules!
        </h1>
        <p className="mt-4 text-md md:text-xl dark:text-gray-300 ">
          Create live rooms, add videos, and let the user's decide what plays
          next.
        </p>
      </div>
      <div className="mt-6 flex gap-4">
        <Link to={isAuthenticated ? "/room" : "/login"}>
          <Button>
            {isAuthenticated ? "Login in now to get started" : "Back to home"}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
