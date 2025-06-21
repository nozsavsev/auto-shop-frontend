import { FaRegCalendarAlt } from "react-icons/fa";

export default function About() {
  return (
    <div className="flex flex-col h-full flex-1 grow items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          About This Project
        </h1>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            Created by <span className="font-semibold text-indigo-600">Ilia Nozdrachev</span>
            <br />
            as a test assignment
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
          <FaRegCalendarAlt className="mr-2 text-xl" />
            <span>on May 30, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
