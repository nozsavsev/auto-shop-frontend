import { API } from "@/src/API";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const dev = process.env.NODE_ENV === "development";

const Er_500 = ({}: any) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const isConnected = await API.Client.Status.GetStatus();
      if (isConnected) {
        setIsConnected(true);

        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`absolute left-0 top-0 transition-all duration-500 flex h-screen w-screen flex-col items-center justify-center bg-black ${
        isConnected ? "text-sky-600" : "text-red-600"
      }`}
    >
      <div className="flex flex-col font-bold text-6xl items-center justify-center">AutoShop</div>

      <motion.div
        hidden={isConnected}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        animate={{ opacity: 1, height: 56, marginTop: 32 }}
        className="flex items-center justify-center px-5 text-3xl font-semibold lg:text-2xl"
      >
        You are offline or the server is down
      </motion.div>

      <motion.div
        hidden={isConnected}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        animate={{ opacity: 1, height: 56, marginTop: 32 }}
        className="flex items-center text-center justify-center px-5 text-lg font-normal lg:text-xl"
      >
        page will automatically refresh once connection is restored
      </motion.div>
    </motion.div>
  );
};

export default Er_500;
