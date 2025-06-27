"use client"

import { useState } from "react"
import axios from "axios"
import { Search, FileText, AlertCircle, Loader2, Eye, Download, ExternalLink } from "lucide-react"

const SearchPdf = () => {
  const [searchText, setSearchText] = useState("")
  const [pdfs, setPdfs] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchText) {
      setError("Please enter text to search.")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(`/api/pdf/search?searchText=${searchText}`)
      setPdfs(response.data) // Set matched PDFs
      setError("") // Clear previous errors
    } catch (err) {
      setError(err.response?.data?.message || "No PDFs found")
      setPdfs([]) // Clear previous results
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = (pdf) => {
    // Display detailed info on click, you can expand this based on your requirements
    alert(
      `PDF Title: ${pdf.title}\nCaption: ${pdf.caption}\nBanglish Text: ${pdf.banglishText}\nBangla Text: ${pdf.banglaText}`,
    )
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            PDF Search
          </h1>
          <p className="text-gray-600 text-lg">Search through PDF documents in Banglish and Bangla</p>
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by Banglish or Bangla text"
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
                  <span>Search PDFs</span>
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

        {/* Results Section */}
        {pdfs.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {pdfs.length} {pdfs.length === 1 ? "result" : "results"} found
              </span>
            </div>

            {/* PDF Results Grid */}
            <div className="grid gap-6">
              {pdfs.map((pdf) => (
                <div
                  key={pdf._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200 group"
                >
                  <div className="flex items-start space-x-4">
                    {/* PDF Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                            {pdf.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{pdf.caption}</p>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleClick(pdf)}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>

                            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg transition-all duration-200">
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </button>

                            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200">
                              <ExternalLink className="h-4 w-4" />
                              <span>Open</span>
                            </button>
                          </div>
                        </div>

                        {/* PDF Status Badge */}
                        <div className="flex-shrink-0 ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pdfs.length === 0 && !error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to search</h3>
            <p className="text-gray-500">Enter your search terms above to find PDF documents</p>
          </div>
        )}

        {/* Search Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Search Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Search in both Banglish and Bangla text</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              <span>Use specific keywords for better results</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <span>Press Enter to search quickly</span>
            </li>
          </ul>
        </div>
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

export default SearchPdf
