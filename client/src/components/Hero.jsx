import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero bg-white py-16 mb-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Text with Animation */}
        <motion.div
          className="w-full sm:w-1/2 text-left ml-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-4">
            Welcome to Banglish Baba
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            We bring together the best of both worlds – Banglish and Bangla.
            BanglishBaba ensures seamless communication by effortlessly
            converting Banglish to authentic Bangla, enabling you to express
            yourself with clarity and cultural richness. Whether you’re creating
            content, learning the language, or simply chatting, we’re here to
            make sure your words resonate in the true spirit of Bangla.
          </p>
          <p className="text-lg font-semibold text-gray-700">
            "Your Language, Our Passion."
          </p>
        </motion.div>

        {/* Right Section - Image with Animation */}
        <motion.div
          className="w-full sm:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/meloria.png" // Replace with your image link
            alt="Doctor"
            className="ml-20 rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
