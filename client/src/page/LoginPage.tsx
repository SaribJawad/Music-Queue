import Button from "../component/Button";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../component/Navbar";

function LoginPage() {
  const handleLogin = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/api/v1/auth/google"
        : API_URL;

    window.location.href = baseURL;
  };

  return (
    <main className="h-dvh w-full flex flex-col gap-3  bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark sm:px-5 sm:py-5 py-2 px-2 ">
      <Navbar />
      <section className=" w-full   flex flex-1  flex-col gap-4 items-center justify-center ">
        <div className="flex flex-col items-center justify-between  h-full gap-10 max-h-[50vh] w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold flex  flex-col gap-2 text-center ">
            Stream, Vote, Play –{" "}
            <span className="keyboard block px-3  rounded-md text-text_dark_secondary">
              <span className="key">Y</span>
              <span className="key">O</span>
              <span className="key">U</span>
              <span className="key">R</span> <span className="key">R</span>
              <span className="key">O</span>
              <span className="key">O</span>
              <span className="key">M</span>
              {/* <span className="key">C,</span> */}
            </span>
            Your Rules!
          </h1>
          <h1 className="border-b border-zinc-500 pb-2 text-base sm:text-lg">
            Login with google now to get started
          </h1>
        </div>
        <Button
          onClick={handleLogin}
          className="flex items-center gap-2 dark:text-white text-text_light "
        >
          Login
          <FcGoogle />
        </Button>
      </section>
    </main>
  );
}

export default LoginPage;
