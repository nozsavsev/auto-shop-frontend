import { Link } from "react-router";

export default function Page404() {
  return (
    <div className="flex flex-col h-full flex-1 grow items-center justify-center text-black">
      <div className="flex divide-x-2 items-center justify-center">
        <h1 className="px-4 text-4xl font-semibold">404</h1>
        <p className=" px-4 text-2xl">Page not found</p>
      </div>
      <Link className="text-xl mt-8 underline font-medium" to="/">
        Home
      </Link>
    </div>
  );
}
