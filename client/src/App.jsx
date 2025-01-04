import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import TextEditor from "./pages/TextEditor";
import Chatbot from "./pages/Chatbot";
import Header from "./components/Header";
import Footer from "./components/Footer"; 
import PrivateRoute from "./components/PrivateRoute";
import FloatingChatbot from "./components/Chatbot";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/SearchUser";
import SearchUser from "./pages/SearchPDF";
export default function App() {
  return (
    <BrowserRouter>
      {/* Shared Components */}
      <Header />
     

      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/editor" element={<TextEditor />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchuser" element={<SearchUser />} />
        </Route>
      </Routes>

      {/* Shared Footer */}
      <Footer />
      <FloatingChatbot iconSrc="/chatbot.png"/>
    </BrowserRouter>
  );
}
