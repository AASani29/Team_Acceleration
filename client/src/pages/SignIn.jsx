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
      navigate("/home");
    } catch (error) {
      dispatch(signInFailure(error));
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
        Welcome Back!
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Don’t have an account?{" "}
        <Link to="/sign-up" className="text-blue-500 font-semibold hover:underline">
          Create a new account.
        </Link>{" "}
        It’s FREE and takes less than a minute!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login Now"}
        </button>
        <OAuth />
      </form>
      <div className="flex items-center justify-center mt-6">
        
      </div>
      <p className="text-center text-red-500 mt-4">
        {error ? error.message || "Wrong credentials" : ""}
      </p>
    </div>
  </div>
</div>

  );
}
