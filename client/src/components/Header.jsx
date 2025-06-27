"use client"

import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white from-indigo-50 to-purple-50 border-b border-purple-100 shadow-lg backdrop-blur-sm sticky top-0 z-50">
      {/* Header container */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/editor" className="flex items-center group">
              <img
                src="/Blingo.png"
                alt="Blingo Logo"
                width={120}
                height={60}
                className="transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/search"
              className="text-purple-800 hover:text-purple-600 transition-all duration-200 font-medium relative group"
            >
              Search
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              to="/editor"
              className="text-purple-800 hover:text-purple-600 transition-all duration-200 font-medium relative group"
            >
              Editor
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop User Profile */}
          <div className="hidden lg:flex items-center">
            <Link to="/profile" className="flex items-center group">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-purple-200 shadow-md transition-transform group-hover:scale-105"
                  />
                  <span className="text-purple-800 font-medium hidden xl:block">
                    {currentUser.username || "Profile"}
                  </span>
                </div>
              ) : (
                <span className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign In
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile User Profile */}
            <Link to="/profile" className="flex items-center">
              {currentUser ? (
                <img
                  src={currentUser.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                />
              ) : (
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-md">
                  Sign In
                </span>
              )}
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-purple-800 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 border-t border-purple-200">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search"
                  className="block py-3 px-4 text-purple-800 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/editor"
                  className="block py-3 px-4 text-purple-800 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Editor
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
