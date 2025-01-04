import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* Left Section */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 text-white px-10">
        <h1 className="text-4xl font-bold mb-6"> Blingo! 👋</h1>
        <p className="text-lg leading-relaxed text-gray-200 text-center">
          Simplify tasks, boost productivity, and achieve goals effortlessly with smart automation
        </p>
        <footer className="absolute bottom-4 text-sm text-gray-300">
          © 2025 Blingo. All rights reserved.
        </footer>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Don’t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-blue-500 font-medium hover:underline"
              >
                Create a new account
              </Link>
              . It’s FREE and takes less than a minute!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Login Now"}
              </button>
            </form>

            {/* Professional Google Sign-In Button */}
            <div className="mt-8 flex flex-col items-center">
              <button
                className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onClick={() => {
                  // Handle Google OAuth logic
                  alert("Google Sign-In clicked");
                }}
              >
                <img
                  src="/Google.png"
                  alt="Google Logo"
                  className="w-5 h-5 mr-3"
                />
                Sign in with Google
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center mt-4">
                {error.message || "Something went wrong!"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
