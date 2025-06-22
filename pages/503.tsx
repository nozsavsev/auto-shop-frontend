import { API } from "@/src/API";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWifi, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";
import Link from "next/link";

const dev = process.env.NODE_ENV === "development";

const Er_500 = ({}: any) => {
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorType, setErrorType] = useState<'503' | '500'>('503');

  const checkConnection = async () => {
    try {
      setIsRetrying(true);
      console.log((await API.Client.Status.GetStatus()));
      const isConnected = (await API.Client.Status.GetStatus()).error == undefined;
      if (isConnected) {
        setIsConnected(true);
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        setRetryCount(prev => prev + 1);
        setErrorType('503');
      }
    } catch (error) {
      setRetryCount(prev => prev + 1);
      setErrorType('500');
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRetry = () => {
    setRetryCount(0);
    checkConnection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-12"
        >
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                isConnected 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : errorType === '500' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                <AnimatePresence mode="wait">
                  {isConnected ? (
                    <motion.div
                      key="connected"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <FaCheckCircle className="text-white text-4xl" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="disconnected"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {errorType === '500' ? (
                        <FaExclamationTriangle className="text-white text-4xl" />
                      ) : (
                        <FaTimes className="text-white text-4xl" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              
              <motion.div
                animate={{ 
                  scale: isConnected ? [1, 1.2, 1] : [1, 1.1, 1],
                  opacity: isConnected ? 1 : 0.7
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isConnected ? 0 : Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              AutoShop
            </h1>
            <div className={`text-lg font-medium ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Connection Restored!' : errorType === '500' ? 'Server Error' : 'Service Unavailable'}
            </div>
          </motion.div>

          
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="offline"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 text-red-400">
                  <FaExclamationTriangle className="text-xl" />
                  <span className="text-lg font-semibold">
                    {errorType === '500' 
                      ? 'Internal Server Error' 
                      : 'You are offline or the server is down'
                    }
                  </span>
                </div>
                
                <p className="text-gray-300 text-base">
                  {errorType === '500' 
                    ? 'Something went wrong on our end. We\'re working to fix it.'
                    : 'We\'re trying to reconnect automatically...'
                  }
                </p>

                
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">
                    Retry attempt: {retryCount}
                  </span>
                </div>

                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <FaHome className="mr-2" />
                    Go Home
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleManualRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRetrying ? (
                      <FaSpinner className="mr-2 animate-spin" />
                    ) : (
                      <FaRedo className="mr-2" />
                    )}
                    {isRetrying ? 'Retrying...' : 'Retry Now'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="online"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <FaWifi className="text-xl" />
                  <span className="text-lg font-semibold">
                    Connection restored successfully!
                  </span>
                </div>
                
                <p className="text-gray-300 text-base">
                  Redirecting you back to the application...
                </p>

                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">
                    Please wait...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default Er_500;
