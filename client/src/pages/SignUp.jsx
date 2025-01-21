import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/editor");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-blue-700 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-4">Blingo! 👋</h1>
        <p className="text-lg text-center max-w-md">
          Simplify tasks, boost productivity, and achieve goals effortlessly with
          smart automation.
        </p>
        <footer className="absolute bottom-5 text-sm text-gray-200">
          © 2025 Blingo. All rights reserved.
        </footer>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
        <div className="max-w-sm w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Create a New Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign in here.
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                User name
              </label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 disabled:opacity-50 "
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <OAuth />
          </form>
          
        </div>
      </div>
    </div>
  );
}
