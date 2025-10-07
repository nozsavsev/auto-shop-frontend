import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="flex w-screen flex-col items-center justify-center bg-white">
      <div className="relative flex w-full flex-col items-center justify-center pb-20 pt-8" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col items-center justify-center text-lg opacity-50 sm:flex-row">
          <div className="flex">
            <Link className="mx-2" href={"/"}>
              Home
            </Link>
            <Link className="mx-2" href={"/about"}>
              About
            </Link>
            <Link className="mx-2" href={"/cars"}>
              Cars
            </Link>
            <Link className="mx-2" href={"/users"}>
              Users
            </Link>
            <Link className="mx-2" href={"https://nozsa.com/legal"}>
              Legal
            </Link>
          </div>
          <div className="mx-2 h-10 bg-black sm:w-px" />

          <div className="flex">
            <Link className="mx-2 text-2xl" href={"https://www.linkedin.com/in/ilia-nozdrachev/"}>
              <FaLinkedin />
            </Link>
            <Link className="mx-2 text-2xl" href={"https://github.com/nozsavsev"}>
              <FaGithub />
            </Link>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col items-center space-y-2">
          <div className="text-sm opacity-60">Source Code</div>
          <div className="flex space-x-4">
            <Link 
              className="flex items-center text-sm opacity-70 hover:opacity-100 transition-opacity" 
              href={"https://github.com/nozsavsev/auto-shop-frontend"}
            >
              <FaGithub className="mr-1 w-3 h-3" />
              Frontend
            </Link>
            <Link 
              className="flex items-center text-sm opacity-70 hover:opacity-100 transition-opacity" 
              href={"https://github.com/nozsavsev/AutoShopAPI"}
            >
              <FaGithub className="mr-1 w-3 h-3" />
              Backend
            </Link>
          </div>
        </div>

        <div className="mt-4 flex opacity-70">{new Date().getFullYear()} Ilia Nozdrachev</div>
      </div>
    </footer>
  );
};

export default Footer;
