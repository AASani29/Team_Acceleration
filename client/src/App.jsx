import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import TextEditor from "./pages/TextEditor";
import Chatbot from "./pages/Chatbot";
import ChatHistory from "./pages/ChatHistory";
import Header from "./components/Header";

import Footer from "./components/Footer"; // Add this if you plan to include a footer
import PrivateRoute from "./components/PrivateRoute";

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
          <Route path="/chat-history" element={<ChatHistory />} />
        </Route>
      </Routes>

      {/* Shared Footer */}
      <Footer />
    </BrowserRouter>
  );
}
