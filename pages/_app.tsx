import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import { ToastContainer } from "react-toastify";

function App({ Component, pageProps }: AppProps) {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  if (isServer) return null;

  return (
    <>
      <div suppressHydrationWarning className="bg-neutral-100">
        {typeof window === "undefined" ? null : (
          <>
            <Component {...pageProps} />
          </>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />{" "}
    </>
  );
}
export default App;
