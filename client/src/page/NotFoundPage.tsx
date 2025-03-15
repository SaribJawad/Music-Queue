import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import Navbar from "../component/Navbar";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col  h-screen text-center dark:bg-background_dark bg-background_light text-text_light dark:text-text_dark px-5 sm:px-7 sm:py-7 py-5 ">
      <Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-10">
        <div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
            404 - Page Not Found
          </h1>
          <p className="text-sm sm:text-base mt-2">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </div>
    </main>
  );
};

export default NotFoundPage;
