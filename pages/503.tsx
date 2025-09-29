import { API } from "@/src/API";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWifi, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaHome, FaRedo, FaRegSmileWink } from "react-icons/fa";
import Link from "next/link";

const dev = process.env.NODE_ENV === "development";

const Er_500 = ({ }: any) => {

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const isConnected = (await API.Client.Status.GetStatus()).error == null;
      setIsConnected(isConnected);
      if (isConnected) {
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        ${isConnected ? "from-green-900  to-green-950" : "from-red-900  to-red-950"}
      min-h-screen bg-radial flex items-center justify-center p-4`}>
      <motion.div className="flex flex-col items-center gap-4 justify-center">

        <AnimatePresence>
          {!isConnected &&
            <motion.div
              key="disconnectedIndicator3"
              initial={{ width: 0, height: 'auto', opacity: 1 }}
              animate={{ width: 'auto', height: 'auto', opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, stiffness: 100, ease: "easeOut" }}
              className="flex items-center justify-center overflow-clip rounded-lg px-4 py-1.5">
              <span className="text-white whitespace-nowrap text-xl font-semibold">
                Service unavailable
              </span>
            </motion.div>
          }
        </AnimatePresence>

        <div className="flex items-center justify-center  overflow-clip shrink-0 w-64 h-64">
          <AnimatePresence mode="wait">
            {!isConnected ?
              <motion.div
                key="disconnectedIndicator"
                initial={{ width: 0, height: 0 }}
                animate={{ width: 'auto', height: 'auto' }}
                exit={{ width: 0, height: 0 }}
                transition={{ duration: 0.2, stiffness: 100, ease: "easeOut" }}
                className="flex items-center justify-center overflow-clip bg-white rounded-full aspect-square p-4">
                <span className="text-red-500 text-8xl font-black shrink-0">503</span>
              </motion.div> :
              <motion.div
                key="connectedIndicator"
                initial={{ width: 0, height: 0 }}
                animate={{ width: 'auto', height: 'auto' }}
                exit={{ width: 0, height: 0 }}
                transition={{ duration: 0.1, stiffness: 100, ease: "easeOut" }}
                className="flex items-center justify-center overflow-clip bg-white rounded-full aspect-square p-4">

                <FaRegSmileWink className="text-green-600 text-9xl shrink-0" />
              </motion.div>
            }
          </AnimatePresence>
        </div>


        <AnimatePresence>
          {!isConnected &&
            <motion.div
              key="disconnectedIndicator3"
              initial={{ width: 0, height: 'auto', opacity: 1 }}
              animate={{ width: 'auto', height: 'auto', opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1, stiffness: 100, ease: "easeOut" }}
              className="flex items-center justify-center overflow-clip rounded-lg px-4 py-1.5">
              <span className="text-white whitespace-nowrap text-xl font-semibold">
                Attempting to reconnect...
              </span>
            </motion.div>
          }
        </AnimatePresence>

      </motion.div>

    </div>
  );
};

export default Er_500;
