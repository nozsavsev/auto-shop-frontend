import Link from "next/link";
import { SiWpexplorer } from "react-icons/si";

export default function Page404() {
  return (
    <div className="flex flex-col items-center justify-center w-full flex-1">
      <div className=" flex bg-white  rounded-lg p-6 border border-neutral-300 shadow-2xl flex-col justify-center">
        <SiWpexplorer className="text-6xl mx-auto text-blue-700 animate-pulse" />

        <span className="text-left text-xl font-medium mt-8">
          No soul has trod this path yet,
          <br /> brave traveler.
        </span>

        <Link href="/" className="font-semibold text-white bg-blue-700 mx-auto mt-8 px-4 py-2 rounded-md">
          Go back home
        </Link>
      </div>
    </div>
  );
}
