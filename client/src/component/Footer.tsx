import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa6";
import { IoLogoTwitter } from "react-icons/io";
import { FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-background_light dark:bg-background_dark py-10 px-5 flex sm:flex-row sm:gap-0 gap-10 flex-col  items-center justify-around dark:text-text_dark  text-text_light">
      <div className="sm:text-start text-center">
        <h4 className="text-2xl ">Music Queue</h4>
        <p className="">Share the rhythm</p>
      </div>
      <nav className="mb-6 md:mb-0">
        <ul className="flex space-x-6 sm:text-base text-sm">
          <li>
            <Link to="#" className=" hover:text-accent transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className=" hover:text-accent transition-colors">
              Privacy
            </Link>
          </li>
          <li>
            <Link to="#" className=" hover:text-accent transition-colors">
              Terms
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex space-x-4">
        <Link to="" className=" hover:text-accent transition-colors">
          <FaFacebookF className="h-6 w-6" />
        </Link>
        <Link to="" className=" hover:text-accent transition-colors">
          <IoLogoTwitter className="h-6 w-6" />
        </Link>
        <Link to="" className=" hover:text-accent transition-colors">
          <FaInstagram className="h-6 w-6" />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
