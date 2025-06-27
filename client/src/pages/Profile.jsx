"use client"

import { useRef, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut, updateUserStart, updateUserSuccess as updateUserSuccessAction, updateUserFailure } from "../redux/user/userSlice"
import Dashboard from "./Dashboard"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
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
  X,
  Save,
} from "lucide-react"

export default function Profile() {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [image, setImage] = useState(undefined)
  const [tab, setTab] = useState("pdfs")
  const [userPDFs, setUserPDFs] = useState([])
  const { currentUser, loading } = useSelector((state) => state.user)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateFormData, setUpdateFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    profilePicture: currentUser?.profilePicture || ''
  })
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)

  useEffect(() => {
    if (currentUser) {
      fetchUserPDFs()
      // Initialize update form with current user data
      setUpdateFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        profilePicture: currentUser.profilePicture || ''
      })
      console.log('Initialized profile picture:', currentUser.profilePicture)
    }
  }, [currentUser])

  useEffect(() => {
    if (image) {
      handleImageUpload(image)
    }
  }, [image])

  const handleImageUpload = async (image) => {
    console.log('Starting image upload for:', image.name)
    setImageFileUploading(true)
    setImageFileUploadError(null)
    setImageFileUploadProgress(0)

    const uploadFormData = new FormData()
    uploadFormData.append('image', image)

    try {
      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include'
      })

      console.log('Upload response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Upload response data:', data)
        setUpdateFormData(prev => {
          const newState = { ...prev, profilePicture: data.imageUrl }
          console.log('Updated form data:', newState)
          return newState
        })
        setImageFileUploadProgress(100)
        console.log('Image uploaded successfully:', data.imageUrl)
      } else {
        const errorData = await response.json()
        console.error('Upload failed with status:', response.status, 'Error:', errorData)
        setImageFileUploadError(errorData.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      console.error('Error stack:', error.stack)
      setImageFileUploadError('Failed to upload image: ' + error.message)
    } finally {
      setImageFileUploading(false)
      console.log('Image upload process completed')
    }
  }

  const fetchUserPDFs = async () => {
    try {
      const response = await fetch("/api/pdf/user-pdfs", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const pdfs = await response.json()
        console.log('Fetched PDFs:', pdfs); // Debug log
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
    setShowUpdateModal(true)
    setUpdateFormData({
      username: currentUser.username,
      email: currentUser.email,
      profilePicture: currentUser.profilePicture
    })
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
  }

  const handleUpdateFormChange = (e) => {
    setUpdateFormData({ ...updateFormData, [e.target.id]: e.target.value })
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSuccess(null)

    if (Object.keys(updateFormData).length === 0) {
      setUpdateUserError('No changes made')
      return
    }

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to finish uploading')
      return
    }

    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateFormData),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateUserFailure(data.message))
        setUpdateUserError(data.message)
      } else {
        dispatch(updateUserSuccessAction(data))
        setUpdateUserSuccess('User updated successfully')
        // Update the local form state with the server response
        setUpdateFormData({
          username: data.username || currentUser.username,
          email: data.email || currentUser.email,
          profilePicture: data.profilePicture || currentUser.profilePicture
        })
        setTimeout(() => {
          setShowUpdateModal(false)
        }, 2000)
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false)
    setUpdateFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      profilePicture: currentUser.profilePicture || ''
    })
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
    setImageFileUploadError(null)
    setImageFileUploadProgress(null)
    setImage(undefined)
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

  const handleDownloadPDF = async (pdf) => {
    try {
      // Debug: Log the PDF object to see what data we have
      console.log('PDF object:', pdf);
      console.log('banglaText value:', pdf.banglaText);
      console.log('banglaText type:', typeof pdf.banglaText);
      
      // Create a temporary div element with proper styling for Bangla text
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: black;
        box-sizing: border-box;
      `;

      // Check if banglaText exists and is valid
      let banglaContent;
      
      if (!pdf.banglaText || 
          pdf.banglaText === 'undefined' || 
          pdf.banglaText.trim() === '' || 
          pdf.banglaText === null) {
        banglaContent = 'বাংলা অনুবাদ পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।';
        console.log('Using fallback text because banglaText is:', pdf.banglaText);
      } else {
        banglaContent = pdf.banglaText;
        console.log('Using actual banglaText:', banglaContent.substring(0, 50) + '...');
      }

      // Create content with proper Bangla text rendering
      const content = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
            ${pdf.title || 'বাংলা লেখা'}
          </h1>
          ${pdf.caption ? `<p style="font-style: italic; text-align: center; margin-bottom: 20px; color: #666; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">${pdf.caption}</p>` : ''}
        </div>
        <div style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
          ${banglaContent}
        </div>
      `;

      tempDiv.innerHTML = content;
      document.body.appendChild(tempDiv);

      // Generate canvas from the div
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        quality: 0.8,
        logging: false,
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight
      });

      // Remove the temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdfDoc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdfDoc.addPage();
        pdfDoc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
        heightLeft -= pageHeight;
      }

      pdfDoc.save(`${pdf.title || 'bangla_story'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
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
                      <button
                        onClick={() => handleDownloadPDF(pdf)}
                        className="text-gray-900 font-medium hover:text-purple-600 transition-colors truncate group flex items-center text-left"
                      >
                        {pdf.title}
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
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
              src={updateFormData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
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
                  src={updateFormData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
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
                    src={updateFormData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
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

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Update Profile</h3>
              <button
                onClick={closeUpdateModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <img
                    src={updateFormData.profilePicture || currentUser.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-purple-100 mx-auto"
                    onClick={() => fileRef.current?.click()}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                {imageFileUploadProgress && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${imageFileUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{imageFileUploadProgress}% uploaded</p>
                  </div>
                )}
                {imageFileUploadError && (
                  <p className="text-red-500 text-sm mt-2">{imageFileUploadError}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={updateFormData.username || ''}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={updateFormData.email || ''}
                  onChange={handleUpdateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Error Messages */}
              {updateUserError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{updateUserError}</p>
                </div>
              )}

              {/* Success Message */}
              {updateUserSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{updateUserSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || imageFileUploading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || imageFileUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
