// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import { FaMapMarkedAlt, FaProjectDiagram, FaListOl, FaWrench } from "react-icons/fa";
import { motion } from "framer-motion";
import ProfilePic from '../assets/profilepic.jpg';
// or
  import { useNavigate } from "react-router-dom";


const HomePage = () => {
const navigate = useNavigate();

  const { isLoggedIn, username, logout } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      id: 1,
      title: "Dijkstra's Map Visualizer",
      summary: "Find the shortest path between locations with interactive maps.",
      buttonText: "Go to Visualizer",
      route: "/dijkstra",
      color: "blue"
    },
    {
      id: 2,
      title: "Prim’s Pipeline Network Simulator",
      summary: "Build minimum-cost pipeline networks using Prim’s Algorithm.",
      buttonText: "View Simulation",
      route: "/network-designer", // adjust this route if needed
      color: "green"
    },
    {
      id: 3,
      title: "Topological Course Scheduler",
      summary: "Plan your course roadmap with topological sorting of prerequisites.",
      buttonText: "Try Scheduling",
      route: "/topo",
      color: "purple"
    },
    {
      id: 4,
      title: "Coming Soon / Extra DSA Tool",
      summary: "Another useful DSA concept — customizable for future.",
      buttonText: "Preview",
      route: "/coming-soon",
      color: "gray"
    }
  ];

  const iconMap = {
    blue: <FaMapMarkedAlt className="w-8 h-8 text-white"/>,
    green: <FaProjectDiagram className="w-8 h-8 text-white"/>,
    purple: <FaListOl className="w-8 h-8 text-white"/>,
    gray: <FaWrench className="w-8 h-8 text-white animate-spin-slow"/>,
};

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">Graph Visualizer Lab</h1>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {username}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition">Signup</Link>
              </div>
            )}
          </div>
        </div>
      </header>

     

      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-50 py-24 overflow-hidden">
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] bg-gradient-to-tl from-blue-200 via-indigo-300 to-transparent opacity-40 blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 mb-10 md:mb-0">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow animate-fade-in-up">Interactive DSA Visualizer Projects</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-lg animate-fade-in-up animation-delay-150">
            Visualize, understand, and explore fundamental algorithms in real-time.
        </p>
        <a href="#projects"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 text-white rounded-lg text-lg font-semibold shadow-lg transition-all duration-200 animate-fade-in-up animation-delay-300"
        >
            Get Started
        </a>
        </div>
        <div className="md:w-1/3 flex flex-col items-center animate-fade-in animation-delay-300">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-tr from-blue-300 via-indigo-200 to-indigo-400 blur-2xl opacity-70 z-0 animate-pulse" />
            {/* <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 p-1 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center"> */}
              {/* <svg className="h-32 w-32 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg> */}
               {/* <img
  src={ProfilePic}
  alt="Profile"
  className="object-cover w-full h-full rounded-full object-top scale-[0.98]"
/> */}
{/* 
            </div>
            </div> */}
        </div>
        // <p className="mt-4 text-gray-700 font-semibold drop-shadow animate-fade-in-up animation-delay-500">Built by Amaan Kumar</p>
        </div>
    </div>
    </section>


    
    <section id="projects" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-100 relative">
    <div className="absolute top-0 right-1/2 w-[32rem] h-[32rem] bg-blue-200 opacity-40 blur-[110px] -z-10" />
    <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16 drop-shadow">Explore DSA Projects</h2>
        <div className="grid gap-12 sm:grid-cols-2">
        {projects.map((project, i) => (
            <div
            key={project.id}
            className={`
                group relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/80 overflow-hidden transition-all duration-300
                hover:-translate-y-3 hover:shadow-2xl hover:bg-white/95 animate-fade-in-up
            `}
            style={{ animationDelay: `${i * 120}ms` }}
            >
            <div className={`absolute - top-0 left-6 p-2 rounded-full shadow-lg 
                ${project.color === "blue" && "bg-gradient-to-tr from-blue-400 to-blue-600"}
                ${project.color === "green" && "bg-gradient-to-tr from-green-400 to-green-600"}
                ${project.color === "purple" && "bg-gradient-to-tr from-purple-500 to-indigo-600"}
                ${project.color === "gray" && "bg-gradient-to-tr from-gray-500 to-gray-700"}
                group-hover:scale-110 transition-transform`}
            >
                {iconMap[project.color]}
            </div>
            <div className="p-8 pt-12">
                <h3 className={`text-2xl font-bold mb-3 mt-5 text-transparent bg-clip-text
                ${project.color === "blue" && "bg-gradient-to-tr from-blue-500 to-blue-800"}
                ${project.color === "green" && "bg-gradient-to-tr from-green-500 to-green-800"}
                ${project.color === "purple" && "bg-gradient-to-r from-purple-500 to-indigo-700"}
                ${project.color === "gray" && "bg-gradient-to-tr from-gray-500 to-gray-700"}
                `}>
                {project.title}
                </h3>
                <p className="text-gray-700 mb-8">{project.summary}</p>
                <button
  onClick={() => {
    if (project.id === 2) {
      // Handle Prim’s simulator specially
      if (isLoggedIn) {
        navigate("/network-designer");
      } else {
        navigate("/home-pipeline"); // or "/login"
      }
    } else {
      navigate(project.route);
    }
  }}
  className={`
    px-8 py-3 mt-4 bg-gradient-to-r
    ${project.color === "blue" && "from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"}
    ${project.color === "green" && "from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"}
    ${project.color === "purple" && "from-purple-600 to-indigo-800 hover:from-purple-700 hover:to-indigo-900"}
    ${project.color === "gray" && "from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"}
    text-white rounded-lg font-medium transition inline-block shadow-md
  `}
>
  {project.buttonText}
</button>

            </div>
            </div>
        ))}
        </div>
    </div>
    </section>
        
    


     



    {/* About the Projects Section */}
        <AboutSection />


        <Footer />
    </div>
  );
};

export default HomePage;








