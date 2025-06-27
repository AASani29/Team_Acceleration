"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth"
import { Mail, Lock, Loader2, AlertCircle, Sparkles, Zap, Shield, LogIn } from "lucide-react"

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/editor")
    } catch (error) {
      dispatch(signInFailure(error))
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-white text-sm font-medium">Welcome Back</span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight">
                  Hello
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    Again!
                  </span>
                </h1>

                <p className="text-xl text-gray-300 max-w-lg">
                  Continue your journey with AI-powered document processing and intelligent automation.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Lightning Fast</h3>
                  <p className="text-gray-400 text-xs">Process documents in seconds</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <Shield className="h-8 w-8 text-green-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Secure</h3>
                  <p className="text-gray-400 text-xs">Enterprise-grade security</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <Sparkles className="h-8 w-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Smart AI</h3>
                  <p className="text-gray-400 text-xs">Intelligent automation</p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <LogIn className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
                  <p className="text-gray-300 text-sm">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Create account
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        placeholder="example@domain.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300 font-medium text-sm">
                          {error.message || "Wrong credentials. Please try again."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" disabled={loading} className="w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative flex items-center justify-center space-x-2 py-3 px-4 text-white font-semibold">
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900/50 text-gray-300">Or continue with</span>
                    </div>
                  </div>

                  {/* OAuth Component */}
                  <div className="[&>*]:bg-white/10 [&>*]:border-white/20 [&>*]:text-white [&>*]:backdrop-blur-sm">
                    <OAuth />
                  </div>
                </form>
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-gray-400 mt-6">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  )
}
