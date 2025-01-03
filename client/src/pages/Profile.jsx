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
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [userPDFs, setUserPDFs] = useState([]); // State to store PDFs
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Fetch PDFs when the profile page loads
  useEffect(() => {
    const fetchUserPDFs = async () => {
      try {
        const response = await fetch("/api/pdf/user-pdfs", {
          method: "GET",
          credentials: "include", // Ensure cookies (JWT token) are sent
        });

        if (response.ok) {
          const pdfs = await response.json();
          setUserPDFs(pdfs); // Set the PDFs to state
        } else {
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        alert("Failed to fetch PDFs!");
      }
    };

    if (currentUser) {
      fetchUserPDFs(); // Fetch PDFs for the logged-in user
    }
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      handleFileUpload(image, "profilePicture");
    }
    if (coverImage) {
      handleFileUpload(coverImage, "coverPicture");
    }
  }, [image, coverImage]);

  const handleFileUpload = async (file, type) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === "profilePicture") {
          setImagePercent(Math.round(progress));
        } else {
          setCoverPercent(Math.round(progress));
        }
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (type === "profilePicture") {
            setFormData({ ...formData, profilePicture: downloadURL });
          } else {
            setFormData({ ...formData, coverPicture: downloadURL });
          }
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "An error occurred while updating the profile.");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error("Error in request:", err);
      setErrorMessage("An error occurred while updating the profile.");
      setSuccessMessage("");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
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
      alert(data.message); // Display success message
    } else {
      alert(data.message || "Failed to update PDF visibility.");
    }
  } catch (error) {
    console.error("Error making PDF public:", error);
    alert("Error making PDF public.");
  }
};
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
      alert(data.message); // Display success message
    } else {
      alert(data.message || "Failed to update PDF visibility.");
    }
  } catch (error) {
    console.error("Error making PDF private:", error);
    alert("Error making PDF private.");
  }
};


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Cover Photo */}
      <div className="relative w-full h-64 bg-gray-200">
        <input
          type="file"
          ref={coverRef}
          hidden
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />
        <div className="relative w-full h-full">
          <img
            src={formData.coverPicture || currentUser.coverPicture || "/cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <button
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-400 transition"
              onClick={() => coverRef.current.click()}
            >
              Change Cover Photo
            </button>
          </div>
        </div>
        {/* Profile Picture */}
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2">
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
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md cursor-pointer"
            onClick={() => fileRef.current.click()}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mt-16">
        <h1 className="text-3xl font-bold text-gray-800">{currentUser.username}</h1>
        <p className="text-gray-600">{currentUser.email}</p>
        <p className="text-gray-500">"Your Bio Goes Here"</p>

        {/* Action Buttons */}
        <div className="flex justify-center mt-4 space-x-4">
          <button className="px-6 py-2 bg-[#2D3748] text-white font-semibold rounded-lg shadow hover:bg-[#1A202C] transition">
            Add Bio
          </button>
          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-400 transition"
          >
            Sign Out
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-400 transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Display PDFs */}
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

      {/* Dynamic Form Section */}
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            defaultValue={currentUser.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleChange}
          />
          <button className="bg-black text-white font-semibold p-3 rounded-lg hover:bg-gray-800 transition">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        <p className="text-green-500 mt-4 text-center">{successMessage}</p>
        <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
      </div>
    </div>
  );
}
