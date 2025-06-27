import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const developers = [
    { name: "Ahmed Alfey Sani", github: "https://github.com/AASani29", linkedin: "" },
    { name: "MD HR Alif", github: "https://github.com/mdhralif", linkedin: "" },
    { name: "Niaz Rahman", github: "https://github.com/niazbuoy08", linkedin: "#" }
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-purple-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Collaborative Story Editor. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Developers</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {developers.map((dev, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">{dev.name}</span>
                  <div className="flex space-x-1">
                    <a href={dev.github} className="text-gray-500 hover:text-purple-600 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href={dev.linkedin} className="text-gray-500 hover:text-purple-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-purple-100 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;