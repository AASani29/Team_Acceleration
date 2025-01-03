import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-white text-[#002a62] shadow-md">
      {/* Header container */}
      <div className="container mx-auto px-4 flex justify-between items-center py-2">
        {/* Logo Section with increased left padding */}
        <div className="flex items-center pl-8">
          <Link to="/">
            <img src="/Blingo.png" alt="Logo" width={120} height={60} />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="flex justify-center space-x-8 text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/editor"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Editor
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
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
                className="h-10 w-10 rounded-full object-cover border-2 border-[#002a62]"
              />
            ) : (
              <span className="text-blue-600 hover:text-[#002a62] transition duration-300">
                Sign In
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden bg-white text-[#002a62]">
        <nav>
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                to="/"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/auth/login"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/editor"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Editor
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-[#002a62] hover:text-blue-600 transition duration-300"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
