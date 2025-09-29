import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { ENV_CONFIG, ENV_CONFIG_Type } from "@/src/API";

function App({ Component, pageProps }: AppProps) {
  
  ENV_CONFIG.API_URL = pageProps.API_URL;
  ENV_CONFIG.API_SSR_URL = pageProps.API_SSR_URL;

  console.log(ENV_CONFIG);

  const router = useRouter();

  // Don't render layout for error pages
  const isErrorPage = router.pathname === "/503" || router.pathname === "/404" || router.pathname === "/500";

  return (
    <>
      {isErrorPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
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
      />
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  let pageProps: any = {
    API_URL: "",
    API_SSR_URL: "",
  };

  // Check if we're in SSR environment
  if (typeof window === "undefined") {
    // SSR environment - server-side rendering
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    pageProps.API_URL = process.env.API_URL;
    pageProps.API_SSR_URL = process.env.API_SSR_URL;
  } else {
    // Client environment - client-side rendering
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    pageProps.API_URL = ENV_CONFIG.API_URL;
    pageProps.API_SSR_URL = ENV_CONFIG.API_SSR_URL;
  }

  return {
    pageProps,
  };
};

export default App;
