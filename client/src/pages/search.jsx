import React from "react";
import { FaFilePdf, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CardLayout = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Actions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Search PDF Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <FaFilePdf className="text-red-500 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search PDF</h2>
          <button
            onClick={() => handleNavigate('/searchpdf')}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            Search PDF
          </button>
        </div>

        {/* Search User Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <FaUser className="text-blue-500 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search User</h2>
          <button
            onClick={() => handleNavigate('/searchuser')}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
          >
            Search User
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
    