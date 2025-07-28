// src/components/Footer.jsx
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-bl from-blue-900 via-indigo-800 to-slate-900 text-white py-10 mt-16 shadow-inner z-10">
      {/* Glassy overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Logo & site info */}
        <div className="flex items-center gap-3">
          <svg className="w-10 h-10 text-blue-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-bold text-2xl tracking-wide">DSA Visualizer Lab</span>
        </div>
        
        {/* Center: Social links */}
        <div className="flex gap-5 mt-3 md:mt-0">
          <a href="https://github.com/yourprofile" target="_blank" rel="noopener" className="hover:text-blue-300 transition">
            <FaGithub className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener" className="hover:text-blue-300 transition">
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener" className="hover:text-blue-300 transition">
            <FaTwitter className="w-6 h-6" />
          </a>
        </div>
        
        {/* Right: Copyright */}
        <p className="text-sm text-gray-200 md:text-right">
          &copy; 2025 <span className="font-semibold text-white">Lovendra Kumar</span>
          <span className="ml-2 text-gray-400">| All rights reserved.</span>
        </p>
      </div>
      
      {/* Scroll to top button */}
      <button
        className="absolute right-6 bottom-6 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full shadow-xl transition z-20 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to Top"
      >
        <svg className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
