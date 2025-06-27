"use client"
import { FileText, Users, ArrowRight, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CardLayout = () => {
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-6 shadow-lg">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Search Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and explore content with our powerful search tools
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Search PDF Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PDF</span>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Search PDF</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find and explore PDF documents with advanced search capabilities
                </p>

                {/* Button */}
                <button
                  onClick={() => handleNavigate("/searchpdf")}
                  className="group/btn relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Search PDF
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-pink-100 rounded-full opacity-30"></div>
            </div>
          </div>

          {/* Search User Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">USER</span>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Search User</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover and connect with users across the platform
                </p>

                {/* Button */}
                <button
                  onClick={() => handleNavigate("/searchuser")}
                  className="group/btn relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Search User
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-indigo-100 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">Choose your search type to get started</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default CardLayout
