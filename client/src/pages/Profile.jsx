import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";
import Dashboard from "./Dashboard"; // Analytics Page Component

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const coverRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [coverImage, setCoverImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [coverPercent, setCoverPercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [tab, setTab] = useState("pdfs"); // Tab state for toggling
  const [userPDFs, setUserPDFs] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) fetchUserPDFs();
  }, [currentUser]);

  const fetchUserPDFs = async () => {
    try {
      const response = await fetch("/api/pdf/user-pdfs", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const pdfs = await response.json();
        setUserPDFs(pdfs);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleUpdate = () => {
    // Update logic
    alert("Update functionality not implemented yet.");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      dispatch(deleteUserStart());
      try {
        // API call to delete user
        dispatch(deleteUserSuccess());
        alert("Account deleted successfully.");
      } catch (error) {
        dispatch(deleteUserFailure());
        alert("Failed to delete account.");
      }
    }
  };

  const renderPDFs = () => (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your PDFs</h2>
      <ul className="space-y-3">
        {userPDFs.length > 0 ? (
          userPDFs.map((pdf) => (
            <li key={pdf._id} className="bg-gray-100 p-3 rounded-lg shadow-md">
              <a
                href={pdf.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {pdf.title}
              </a>
              <p className="text-gray-600">{pdf.caption}</p>
              {/* If PDF is public, show the "Make Private" button */}
          {pdf.isPublic && (
            <button
              onClick={() => handleMakePrivate(pdf._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2"
            >
              Make Private
            </button>
          )}

          {/* If PDF is private, show the "Make Public" button */}
          {!pdf.isPublic && (
            <button
              onClick={() => handleMakePublic(pdf._id)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg mt-2"
            >
              Make Public
            </button>
          )}

          {/* If the PDF is public */}
          {pdf.isPublic && (
            <span className="text-green-500 mt-2">This PDF is public.</span>
          )}

          {/* If the PDF is private */}
          {!pdf.isPublic && (
            <span className="text-red-500 mt-2">This PDF is private.</span>
          )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No PDFs found.</p>
        )}
      </ul>
    </div>
  );

  const renderAnalytics = () => (
    <div className="mt-10">
      <Dashboard />
    </div>
  );
 
const handleMakePrivate = async (pdfId) => {
  try {
    const response = await fetch("/api/pdf/make-private", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ pdfId }),
    });

    const data = await response.json();

    if (response.ok) {
      setUserPDFs((prevPDFs) =>
        prevPDFs.map((pdf) =>
          pdf._id === pdfId ? { ...pdf, isPublic: false } : pdf
        )
      );
      alert(data.message || "PDF visibility updated to private.");
    } else {
      alert(data.message || "Failed to update PDF visibility.");
    }
  } catch (error) {
    console.error("Error making PDF private:", error);
    alert("Error making PDF private.");
  }
};

const handleMakePublic = async (pdfId) => {
  try {
    const response = await fetch("/api/pdf/make-public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ pdfId }),
    });

    const data = await response.json();

    if (response.ok) {
      setUserPDFs((prevPDFs) =>
        prevPDFs.map((pdf) =>
          pdf._id === pdfId ? { ...pdf, isPublic: true } : pdf
        )
      );
      alert(data.message || "PDF visibility updated to public.");
    } else {
      alert(data.message || "Failed to update PDF visibility.");
    }
  } catch (error) {
    console.error("Error making PDF public:", error);
    alert("Error making PDF public.");
  }
};


  return (
    <div className=" min-h-screen mb-10">
     {/* Profile Image */}
<div className="relative w-full h-24 bg-white ">
  <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 ">
    <input
      type="file"
      ref={fileRef}
      hidden
      accept="image/*"
      onChange={(e) => setImage(e.target.files[0])}
    />
    <img
      src={formData.profilePicture || currentUser.profilePicture}
      alt="profile"
      className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg cursor-pointer hover:opacity-90"
      onClick={() => fileRef.current.click()}
    />
  </div>
</div>

{/* User Info */}
<div className="text-center mt-20 ">
  <h1 className="text-4xl font-bold text-gray-900">{currentUser.username}</h1>
  <p className="text-gray-700 text-sm">{currentUser.email}</p>
</div>

{/* Account Options */}
<div className="mt-4 max-w-lg mx-auto flex justify-center space-x-4">
  <button
    onClick={handleUpdate}
    className="px-4 py-2 bg-green-600 text-white font-xl rounded-lg shadow-md transition duration-200 hover:bg-green-500"
  >
    Update Profile
  </button>
  <button
    onClick={handleDelete}
    className="px-4 py-2 bg-red-600 text-white font-xl rounded-lg shadow-md transition duration-200 hover:bg-red-500"
  >
    Delete Account
  </button>
  <button
    onClick={handleSignOut}
    className="px-4 py-2 bg-gray-600 text-white font-xl rounded-lg shadow-md transition duration-200 hover:bg-gray-500"
  >
    Sign Out
  </button>
</div>


    <div className="mt-10 flex justify-center items-center bg-white p-4 rounded-lg shadow-md">
  <button
    onClick={() => setTab("pdfs")}
    className={`px-6 py-2 text-black font-semibold relative group ${tab === "pdfs" ? "text-blue-500" : "text-gray-500"}`}
  >
    Your PDFs
    <span
      className={`absolute bottom-0 left-0 w-full h-1 bg-blue-500 transition-all duration-300 ease-in-out transform ${
        tab === "pdfs" ? "scale-x-100" : "scale-x-0"
      } group-hover:scale-x-100`}
    />
  </button>
  <button
    onClick={() => setTab("analytics")}
    className={`px-6 py-2 text-black font-semibold relative group ${tab === "analytics" ? "text-blue-500" : "text-gray-500"}`}
  >
    Analytics
    <span
      className={`absolute bottom-0 left-0 w-full h-1 bg-blue-500 transition-all duration-300 ease-in-out transform ${
        tab === "analytics" ? "scale-x-100" : "scale-x-0"
      } group-hover:scale-x-100`}
    />
  </button>
</div>




      {/* Tab Content */}
      {tab === "pdfs" ? renderPDFs() : renderAnalytics()}

      
    </div>
  );
}
