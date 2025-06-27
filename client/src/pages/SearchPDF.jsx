"use client"

import { useState } from "react"
import axios from "axios"
import { Search, User, Mail, AlertCircle, Loader2, UserCheck } from "lucide-react"

const SearchUser = () => {
  const [username, setUsername] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!username) {
      setError("Please enter a username.")
      return
    }

    setIsLoading(true)
    try {
      // Send GET request to the backend
      const response = await axios.get(`/api/users/search?username=${username}`)
      setUserProfile(response.data) // Set user profile data
      setError("") // Clear error if search is successful
    } catch (err) {
      setError(err.response?.data?.message || "User not found")
      setUserProfile(null) // Clear previous results
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            User Search
          </h1>
          <p className="text-gray-600 text-lg">Find and discover user profiles</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by username"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search User</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* User Profile Results */}
        {userProfile && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-fade-in">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-6">
              <div className="flex items-center space-x-4">
                <UserCheck className="h-8 w-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">User Found</h2>
                  <p className="text-purple-100">Profile information</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={userProfile.profilePicture || "/placeholder.svg"}
                      alt={userProfile.username}
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{userProfile.username}</h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="text-gray-900">@{userProfile.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-colors duration-200">
                    View Profile
                  </button>
                  <button className="flex-1 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg transition-colors duration-200">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!userProfile && !error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to search</h3>
            <p className="text-gray-500">Enter a username above to find user profiles</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SearchUser
