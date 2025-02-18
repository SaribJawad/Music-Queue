import { Link, Navigate, useNavigate } from "react-router-dom";
import ThemeToggle from "../component/ui/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useAuthContext } from "../contexts/authContext";
import { useEffect } from "react";

function LoginPage() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const from = localStorage.getItem("redirectUrl");

  useEffect(() => {
    if (isAuthenticated === "true" && from) {
      navigate(from, { replace: true });
      localStorage.removeItem("redirectUrl");
    }
  }, [isAuthenticated, from, navigate]);

  const handleLogin = () => {
    try {
      window.location.href = "http://localhost:3000/api/v1/auth/google";
    } catch (error) {
      toast.error("Something went wrong while logging in");
    }
  };

  return (
    <div className="h-dvh w-full dark:bg-background_dark bg-background_light px-5">
      <nav className="py-4 sm:px-6 px-1 flex items-center justify-between lg:w-[80%] w-full lg:mx-auto  ">
        <h1 className="text-xl flex items-center cursor-pointer gap-2 font-semibold text-text_light dark:text-text_dark hover:-translate-x-1 transition-all duration-300">
          <ArrowLeft size={20} className="" />
          <Link to="/">Go Back</Link>
        </h1>
        <ThemeToggle />
      </nav>
      <div className="w-fit mx-auto h-full -mt-16 flex flex-col justify-center gap-10 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="dark:text-text_dark text-text_light text-4xl sm:text-5xl font-semibold">
            Login in with Google Now
          </h1>
          <p className="dark:text-text_dark text-text_light font-medium">
            To get Started
          </p>
        </div>
        <button
          onClick={handleLogin}
          className="bg-background_dark dark:bg-white w-fit self-center px-4 py-2 rounded-md text-text_dark dark:text-text_light flex items-center gap-3"
        >
          Login with <FcGoogle size={20} />
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
