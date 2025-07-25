import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/network-bg.png"; // Ensure this image exists!

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen overflow-x-hidden"> {/* Added min-h-screen and overflow-x-hidden */}
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center text-white flex flex-col justify-center items-center px-6 py-20 overflow-hidden" // Changed min-h-screen to h-screen to ensure it always fills the viewport height
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center drop-shadow-2xl animate-fade-in-up">
            Pipeline Network Designer
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-center mb-8 drop-shadow-xl animate-fade-in-up animation-delay-200">
            Design cost-effective pipeline networks using <span className="font-semibold text-blue-300">Prim’s Algorithm</span>. Visualize, save, and manage your designs effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* What It Offers Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white text-gray-800 text-center"> {/* Added gradient background */}
        <h2 className="text-4xl font-bold mb-12 text-gray-900">What It Offers</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-left">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              <i className="fas fa-project-diagram mr-3"></i>Graph Design
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Intuitively create custom nodes and edges to accurately represent your complex pipeline network. Add connections with ease.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-green-700">
              <i className="fas fa-calculator mr-3"></i>Best Route Calculation
            </h3> {/* Updated text */}
            <p className="text-gray-700 leading-relaxed">
              Leverage the power of Prim's algorithm to instantly compute the optimal cost path, revealing the most cost-effective pipeline layout.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-purple-700">
              <i className="fas fa-save mr-3"></i>Save and Load Designs
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Securely store all your intricate network designs in the cloud and effortlessly load them anytime to resume your work.
            </p>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 px-6 bg-gradient-to-tl from-white to-gray-50 text-gray-800 text-center"> {/* Added gradient background */}
        <h2 className="text-4xl font-bold mb-12 text-gray-900">How to Get Started</h2>
        <div className="max-w-5xl mx-auto space-y-12 text-left">
          <div className="flex items-start bg-gray-100 p-6 rounded-lg shadow-md">
            <span className="text-3xl font-bold text-blue-600 mr-4">1.</span>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Sign Up / Login</h4>
              <p className="text-gray-700">Begin by creating a free account or logging in to access your personalized design dashboard.</p>
            </div>
          </div>
          <div className="flex items-start bg-gray-100 p-6 rounded-lg shadow-md">
            <span className="text-3xl font-bold text-blue-600 mr-4">2.</span>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Design Your Network</h4>
              <p className="text-gray-700">Use the intuitive interface to add nodes (cities, plants, tanks) and connect them with weighted edges representing pipeline costs.</p>
            </div>
          </div>
          <div className="flex items-start bg-gray-100 p-6 rounded-lg shadow-md">
            <span className="text-3xl font-bold text-blue-600 mr-4">3.</span>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Generate Optimal Pipeline</h4> {/* Updated text */}
              <p className="text-gray-700">With a single click, identify the optimal pipeline for your network, showing the most efficient and cost-effective connections.</p> {/* Updated text */}
            </div>
          </div>
          <div className="flex items-start bg-gray-100 p-6 rounded-lg shadow-md">
            <span className="text-3xl font-bold text-blue-600 mr-4">4.</span>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Save and Analyze</h4>
              <p className="text-gray-700">Store your designs for future reference and review the MST output directly on the interactive graph.</p>
            </div>
          </div>
        </div>
        <button
            onClick={() => navigate("/signup")} // Changed to navigate to /signup
            className="mt-12 bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-lg font-bold text-white text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Start Designing Now! <i className="fas fa-arrow-right ml-2"></i>
          </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-6 px-4 sm:px-8 text-sm flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
        {/* Left Section */}
        <span className="mb-2 sm:mb-0 text-gray-500">
          &copy; {new Date().getFullYear()} Pipeline Network Designer. All rights reserved.
        </span>
        {/* Right Section */}
        <span className="text-gray-600 font-medium">
          Built by <a href="https://www.linkedin.com/in/adarsh-kumar0412/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">Adarsh Kumar</a> &middot; DTU &middot; 2026
        </span> {/* Changed year back to 2025 as per original request */}
      </footer>

      {/* Tailwind CSS Keyframe Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
