import React, { useState } from "react";
import axios from "axios";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    try {
      // Send GET request to the backend
      const response = await axios.get(`/api/users/search?username=${username}`);  // Fixed the URL string
      setUserProfile(response.data); // Set user profile data
      setError(""); // Clear error if search is successful
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
      setUserProfile(null); // Clear previous results
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search by username"
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userProfile && (
        <div>
          <h2>{userProfile.username}</h2>
          <img src={userProfile.profilePicture} alt={userProfile.username} width={100} />
          <p>Email: {userProfile.email}</p>
          {/* Add other user details if needed */}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
