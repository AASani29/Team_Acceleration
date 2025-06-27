"use client"
import { FileText, Users, ArrowRight, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CardLayout = () => {
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10 w-full max-w-4xl">
      

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Search PDF Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Search PDF</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find and explore PDF documents with advanced search capabilities
              </p>

              {/* Button */}
              <button
                onClick={() => handleNavigate("/searchpdf")}
                className="w-full group/btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Search PDF</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Search User Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Users className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Search User</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">Discover and connect with users across the platform</p>

              {/* Button */}
              <button
                onClick={() => handleNavigate("/searchuser")}
                className="w-full group/btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Search User</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        
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
