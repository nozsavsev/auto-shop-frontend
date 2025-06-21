import Link from "next/link";
import { useRouter } from "next/router";
import { IoCar, IoCarOutline, IoInformationCircle, IoInformationCircleOutline, IoPerson, IoPersonOutline } from "react-icons/io5";

export default function TitleBar() {
  
  const router = useRouter();



  return (
    <header className="bg-white shadow-md mb-2 h-[4rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-normal md:text-xl font-bold text-gray-800 hover:text-gray-600"
            >
              Auto Shop
            </Link>
          </div>

          <nav className="flex space-x-2 md:space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                location.pathname === "/" || location.pathname === "/users"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
                
                <span className="text-xl mr-2 mb-0.5">
                {location.pathname === "/" ? <IoPerson   /> : <IoPersonOutline   />}
              </span>

              Users
            </Link>

            <Link
              href="/cars"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                location.pathname === "/cars"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="text-xl mr-2">
                {location.pathname === "/cars" ? <IoCar /> : <IoCarOutline />}
              </span>
              Cars
            </Link>

            <Link
              href="/about"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                location.pathname === "/about"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
                   <span className="text-xl mr-2">
                {location.pathname === "/about" ? <IoInformationCircle  /> : <IoInformationCircleOutline  />}
              </span>
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
