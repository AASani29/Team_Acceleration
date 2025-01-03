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
            title: "Track Mood",
            description:
              "A chatbot interface to record your current mood and offer mindfulness exercises.",
            color: "text-blue-500",
            path: "/track-mood",
          },
          {
            id: 2,
            title: "Get Health Tips",
            description:
              "Receive personalized health tips based on your preferences and lifestyle.",
            color: "text-green-500",
            path: "/get-health-tips",
          },
          {
            id: 3,
            title: "View Progress",
            description:
              "Monitor your progress with detailed insights and analytics.",
            color: "text-purple-500",
            path: "/view-progress",
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

        {/* Call-to-Action Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to take control of your health?
          </h2>
          <Link
            to="/get-started"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
