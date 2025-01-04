import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

export default function Home() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = () => {
      setTimeout(() => {
        setFeatures([
          {
            id: 1,
            title: "AI Chatbot",
            description:
              "An AI-powered chatbot that seamlessly converts Banglish text into fluent Bangla, making communication simple, fast, and effective!",
            color: "text-blue-500",
            path: "/chatbot",
          },
          {
            id: 2,
            title: "Text-Editor",
            description:
              "A smart text editor to effortlessly convert Banglish stories into perfect Bangla, enhancing creativity!",
            color: "text-green-500",
            path: "/editor",
          },
          {
            id: 3,
            title: "Analytic Dashboard",
            description:
              "An intuitive dashboard showcasing word counts, stories written, and engagement stats for deeper insights!",
            color: "text-purple-500",
            path: "/admin/dashboard",
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchFeatures();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-between px-4 md:px-8 pt-16 pb-16">
      {/* Main Content */}
      <div className="flex flex-col items-center">
        <Hero />

        {/* Features Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {loading ? (
            <div className="col-span-3 flex justify-center">
              <p className="text-gray-600 text-lg">Loading features...</p>
            </div>
          ) : (
            features.map((feature) => (
              <Link
                key={feature.id}
                to={feature.path}
                className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <h3 className={`text-xl font-semibold ${feature.color}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </Link>
            ))
          )}
        </div>


        To make the "Get Started" button restart the app (essentially refresh the page), you can update the onClick behavior to reload the current window.

        Here's the updated code for the Get Started button:

        Updated Code
        jsx
        Copy code
        {/* Call-to-Action Section */}
        <div className="mt-16 text-center">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Transform how you communicate!
          </h2>

          {/* Button */}
          <button
            onClick={() => window.location.reload()} // Reloads the page
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-lg font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
}
