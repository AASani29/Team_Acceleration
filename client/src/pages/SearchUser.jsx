import React, { useState } from "react";
import axios from "axios";

const SearchPdf = () => {
  const [searchText, setSearchText] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchText) {
      setError("Please enter text to search.");
      return;
    }

    try {
      const response = await axios.get(`/api/pdf/search?searchText=${searchText}`);
      setPdfs(response.data);  // Set matched PDFs
      setError("");  // Clear previous errors
    } catch (err) {
      setError(err.response?.data?.message || "No PDFs found");
      setPdfs([]);  // Clear previous results
    }
  };

  const handleClick = (pdf) => {
    // Display detailed info on click, you can expand this based on your requirements
    alert(`PDF Title: ${pdf.title}\nCaption: ${pdf.caption}\nBanglish Text: ${pdf.banglishText}\nBangla Text: ${pdf.banglaText}`);
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by Banglish or Bangla text"
        className="w-full mt-4 h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a62]"
      />
      <button
        onClick={handleSearch}
        className="mt-4 px-5 py-2 bg-[#002a62] text-white rounded-md hover:bg-[#003b82] transition-all"
      >
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pdfs.length > 0 && (
        <div>
          {pdfs.map((pdf) => (
            <div key={pdf._id} className="border p-4 mt-4 rounded-lg">
              <h3 className="text-lg font-semibold">{pdf.title}</h3>
              <p className="text-sm">{pdf.caption}</p>
              <button
                onClick={() => handleClick(pdf)}
                className="text-blue-600 hover:underline mt-2"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPdf;


