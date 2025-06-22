import Link from "next/link";
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Page404() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-4xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for seems to have driven off into the sunset.
            </p>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaHome className="mr-2" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <FaSearch className="mr-2" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
