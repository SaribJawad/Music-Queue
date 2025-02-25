import Button from "../component/Button";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../component/Navbar";

function LoginPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  };

  return (
    <main className="h-dvh w-full flex flex-col gap-3  bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark sm:px-5 sm:py-5 py-2 px-2 ">
      <Navbar />
      <section className=" w-full   flex flex-1  flex-col gap-4 items-center justify-center">
        <h1 className="border-b border-zinc-500 pb-2 text-base sm:text-lg">
          Login with google now to get started
        </h1>
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
