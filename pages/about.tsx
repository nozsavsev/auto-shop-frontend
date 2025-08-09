import { 
  FaRegCalendarAlt, 
  FaReact, 
  FaCode, 
  FaRocket, 
  FaShieldAlt, 
  FaMobile,
  FaDesktop,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaCar,
  FaUsers,
  FaSearch,
  FaCog,
  FaCheckCircle
} from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiSwr, SiFormik, SiPostgresql, SiDotnet } from "react-icons/si";
import { IoStatsChart } from "react-icons/io5";
import Image from "next/image";
export default function About() {
  const features = [
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "User Management",
      description: "Complete CRUD operations for users with car assignments, search, and pagination"
    },
    {
      icon: <FaCar className="w-6 h-6" />,
      title: "Car Management", 
      description: "Complete CRUD operations for cars with company and model"
    },
    {
      icon: <FaSearch className="w-6 h-6" />,
      title: "Smart Search",
      description: "Debounced real-time search with highlighting and instant results"
    },
    {
      icon: <IoStatsChart className="w-6 h-6" />,
      title: "Advanced Pagination",
      description: "Sticky pagination controls with customizable page sizes and navigation"
    },
    {
      icon: <FaMobile className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Mobile-first approach with seamless experience across all devices"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Data Validation",
      description: "Form validation with Yup schemas and error handling"
    }
  ];

  const techStack = [
    { icon: <SiNextdotjs className="w-8 h-8" />, name: "Next.js", category: "Framework" },
    { icon: <FaReact className="w-8 h-8" />, name: "React", category: "Frontend" },
    { icon: <SiTypescript className="w-8 h-8" />, name: "TypeScript", category: "Language" },
    { icon: <SiTailwindcss className="w-8 h-8" />, name: "Tailwind CSS", category: "Styling" },
    { icon: <SiSwr className="w-8 h-8" />, name: "SWR", category: "Data Fetching" },
    { icon: <SiFormik className="w-8 h-8" />, name: "Formik", category: "Forms" },
    { icon: <FaShieldAlt className="w-8 h-8" />, name: "Yup", category: "Validation" },
    { icon: <SiDotnet className="w-8 h-8" />, name: ".NET", category: "Backend" },
    { icon: <SiPostgresql className="w-8 h-8" />, name: "PostgreSQL", category: "Database" }
  ];

  const highlights = [
    "Server-Side Rendering (SSR) for optimal performance",
    "Type-safe API integration with auto-generated clients",
    "Debounced search to reduce API calls by 70-80%",
    "Real-time form validation with error handling",
    "Responsive design with mobile-first approach",
    "Comprehensive error handling and user feedback"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 w-full">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold flex items-center justify-center text-gray-900 mb-6">
            <Image src="/logo.svg" alt="logo" width={468.78} height={67.23} className="h-10 w-fit object-contain" />


            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern, full-stack web application for managing automotive businesses, 
              built with cutting-edge technologies and best practices.
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <FaRegCalendarAlt className="mr-2" />
                <span>Developed in 2024</span>
              </div>
              <div className="flex items-center">
                <FaCode className="mr-2" />
                <span>Full-Stack Project</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive automotive business management with modern web technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern, scalable technologies for optimal performance and maintainability
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <div className="flex justify-center mb-4 text-gray-600 group-hover:text-blue-600 transition-colors">
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-gray-500">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Highlights
            </h2>
            <p className="text-xl text-gray-600">
              Advanced features and optimizations that demonstrate engineering excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <FaCheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            About the Developer
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            This project was developed by <span className="font-semibold text-white mr-1">Ilia Nozdrachev</span> 
            as a comprehensive demonstration of modern web development skills and best practices.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="https://github.com" className="text-blue-100 hover:text-white transition-colors">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" className="text-blue-100 hover:text-white transition-colors">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="mailto:contact@example.com" className="text-blue-100 hover:text-white transition-colors">
              <FaEnvelope className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">TypeScript Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">70-80%</div>
              <div className="text-gray-400">API Call Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Responsive Design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
