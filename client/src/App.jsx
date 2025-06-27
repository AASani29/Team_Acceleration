import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import TextEditor from "./pages/TextEditor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import FloatingChatbot from "./components/Chatbot";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/search";
import SearchUser from "./pages/SearchPDF";
import SearchPdf from "./pages/SearchUser";

function AppContent() {
  const location = useLocation();

  // Define the routes where the Header, Footer, and Chatbot should not appear
  const hideSharedComponents =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <>
      {/* Conditionally Render Shared Components */}
      {!hideSharedComponents && <Header />}

      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<TextEditor />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/editor" element={<TextEditor />} />
        
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchuser" element={<SearchUser />} />
          <Route path="/searchpdf" element={<SearchPdf />} />
          
        </Route>
      </Routes>

      {/* Conditionally Render Footer and Chatbot */}
      {!hideSharedComponents && <Footer />}
      {!hideSharedComponents && <FloatingChatbot iconSrc="/chatbot.png" />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}