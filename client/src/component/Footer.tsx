import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-background_dark_secondary dark:bg-background_dark py-10 px-5 flex sm:flex-row sm:gap-0 gap-10 flex-col  items-center justify-around">
      <div className="sm:text-start text-center">
        <h4 className="text-2xl text-text_dark">Music Queue</h4>
        <p className="text-white">Share the rhythm</p>
      </div>
      <nav className="mb-6 md:mb-0">
        <ul className="flex space-x-6">
          <li>
            <Link
              to="#"
              className="text-gray-400 hover:text-text_dark transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="text-gray-400 hover:text-text_dark transition-colors"
            >
              Privacy
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="text-gray-400 hover:text-text_dark transition-colors"
            >
              Terms
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex space-x-4">
        <Link
          to=""
          className="text-gray-400 hover:text-text_dark transition-colors"
        >
          <Facebook className="h-6 w-6" />
        </Link>
        <Link
          to=""
          className="text-gray-400 hover:text-text_dark transition-colors"
        >
          <Twitter className="h-6 w-6" />
        </Link>
        <Link
          to=""
          className="text-gray-400 hover:text-text_dark transition-colors"
        >
          <Instagram className="h-6 w-6" />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
