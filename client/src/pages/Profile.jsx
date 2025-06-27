"use client"

import { useRef, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../redux/user/userSlice"
import Dashboard from "./Dashboard"
import {
  Camera,
  FileText,
  BarChart3,
  Settings,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
  ExternalLink,
  User,
  Mail,
  Shield,
  Globe,
  Lock,
} from "lucide-react"

export default function Profile() {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const coverRef = useRef(null)
  const [image, setImage] = useState(undefined)
  const [coverImage, setCoverImage] = useState(undefined)
  const [imagePercent, setImagePercent] = useState(0)
  const [coverPercent, setCoverPercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [tab, setTab] = useState("pdfs")
  const [userPDFs, setUserPDFs] = useState([])
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (currentUser) fetchUserPDFs()
  }, [currentUser])

  const fetchUserPDFs = async () => {
    try {
      const response = await fetch("/api/pdf/user-pdfs", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const pdfs = await response.json()
        setUserPDFs(pdfs)
      } else {
        const errorData = await response.json()
        alert(errorData.message)
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error)
    }
  }

  const handleSignOut = () => {
    dispatch(signOut())
  }

  const handleUpdate = () => {
    alert("Update functionality not implemented yet.")
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      dispatch(deleteUserStart())
      try {
        dispatch(deleteUserSuccess())
        alert("Account deleted successfully.")
      } catch (error) {
        dispatch(deleteUserFailure())
        alert("Failed to delete account.")
      }
    }
  }

  const handleMakePrivate = async (pdfId) => {
    try {
      const response = await fetch("/api/pdf/make-private", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ pdfId }),
      })

      const data = await response.json()

      if (response.ok) {
        setUserPDFs((prevPDFs) => prevPDFs.map((pdf) => (pdf._id === pdfId ? { ...pdf, isPublic: false } : pdf)))
        alert(data.message || "PDF visibility updated to private.")
      } else {
        alert(data.message || "Failed to update PDF visibility.")
      }
    } catch (error) {
      console.error("Error making PDF private:", error)
      alert("Error making PDF private.")
    }
  }

  const handleMakePublic = async (pdfId) => {
    try {
      const response = await fetch("/api/pdf/make-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ pdfId }),
      })

      const data = await response.json()

      if (response.ok) {
        setUserPDFs((prevPDFs) => prevPDFs.map((pdf) => (pdf._id === pdfId ? { ...pdf, isPublic: true } : pdf)))
        alert(data.message || "PDF visibility updated to public.")
      } else {
        alert(data.message || "Failed to update PDF visibility.")
      }
    } catch (error) {
      console.error("Error making PDF public:", error)
      alert("Error making PDF public.")
    }
  }

  const publicPDFs = userPDFs.filter((pdf) => pdf.isPublic).length
  const privatePDFs = userPDFs.filter((pdf) => !pdf.isPublic).length

  const renderPDFs = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total PDFs</p>
              <p className="text-2xl font-bold">{userPDFs.length}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Public</p>
              <p className="text-2xl font-bold">{publicPDFs}</p>
            </div>
            <Globe className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Private</p>
              <p className="text-2xl font-bold">{privatePDFs}</p>
            </div>
            <Lock className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* PDF List */}
      {userPDFs.length > 0 ? (
        <div className="space-y-3">
          {userPDFs.map((pdf) => (
            <div
              key={pdf._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <a
                        href={pdf.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 font-medium hover:text-purple-600 transition-colors truncate group flex items-center"
                      >
                        {pdf.title}
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                          pdf.isPublic ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pdf.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{pdf.caption}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  {pdf.isPublic ? (
                    <button
                      onClick={() => handleMakePrivate(pdf._id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      title="Make Private"
                    >
                      <EyeOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Private</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakePublic(pdf._id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                      title="Make Public"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Public</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500">Upload your first PDF to get started</p>
        </div>
      )}
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Dashboard />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={formData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{currentUser.username}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <img
                  src={formData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-purple-100"
                  onClick={() => fileRef.current.click()}
                />
                <div className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-full shadow-lg cursor-pointer transition-colors">
                  <Camera className="h-3 w-3" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{currentUser.username}</h2>
              <p className="text-gray-500 text-sm">{currentUser.email}</p>
            </div>

            {/* User Info Cards */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Username</p>
                  <p className="text-sm text-gray-500">{currentUser.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                <Shield className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Status</p>
                  <p className="text-sm text-green-600 font-medium">Active</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpdate}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Settings className="h-4 w-4" />
                <span>Update Profile</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.username}!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your documents and view your analytics</p>
            </div>

            {/* Mobile Profile Card */}
            <div className="lg:hidden bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <img
                    src={formData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-purple-100"
                    onClick={() => fileRef.current.click()}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full shadow-lg cursor-pointer transition-colors">
                    <Camera className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{currentUser.username}</h3>
                  <p className="text-gray-500 text-sm">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleUpdate}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Update</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 lg:mb-8 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
              <button
                onClick={() => setTab("pdfs")}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 font-medium rounded-md transition-all duration-200 ${
                  tab === "pdfs" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </button>
              <button
                onClick={() => setTab("analytics")}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 font-medium rounded-md transition-all duration-200 ${
                  tab === "analytics" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Tab Content */}
            <div>{tab === "pdfs" ? renderPDFs() : renderAnalytics()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
