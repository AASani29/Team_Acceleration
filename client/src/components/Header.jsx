import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      {/* Header container */}
      <div className="container mx-auto px-4 flex justify-between items-center py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/Logo (2).png" alt="Logo" width={120} height={60} />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="flex justify-center space-x-8 text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile or Sign-In */}
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="flex items-center space-x-2">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <span className="text-green-400 hover:text-gray-400 transition duration-300">
                Sign In
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden bg-gray-700">
        <nav>
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/auth/login"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="text-gray-300 hover:text-green-400 transition duration-300"
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
