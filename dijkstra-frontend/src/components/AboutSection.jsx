// src/components/AboutSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaProjectDiagram, FaListOl, FaWrench } from "react-icons/fa";

const aboutItems = [
  {
    color: "from-blue-400 to-blue-600",
    icon: <FaMapMarkedAlt className="w-8 h-8 text-white" />,
    title: "Dijkstra’s Map Visualizer",
    desc: "Find the shortest path between nodes using Dijkstra's Algorithm.",
    bullets: [
      "Interactive grid where users place nodes and weights",
      "Dynamic path drawing and cost display",
      "Used for road maps, routing, and game AI",
    ],
  },
  {
    color: "from-green-400 to-green-600",
    icon: <FaProjectDiagram className="w-8 h-8 text-white" />,
    title: "Prim’s Pipeline Network Simulator",
    desc: "Build minimum-cost pipeline networks using Prim’s Algorithm.",
    bullets: [
      "Graph-based interface with adjustable weights",
      "Shows how to connect all nodes (like cities or tanks) with minimal total cost",
      "Great for water supply planning, electrical grids, and fiber optics",
    ],
  },
  {
    color: "from-purple-500 to-indigo-600",
    icon: <FaListOl className="w-8 h-8 text-white" />,
    title: "Topological Course Scheduler",
    desc: "Plan your course roadmap based on prerequisites.",
    bullets: [
      "Form builder for entering course names and their dependencies",
      "Validates prerequisites and shows sorted sequence",
      "Perfect for students to avoid future course conflicts",
    ],
  },
  {
    color: "from-gray-400 to-gray-600",
    icon: <FaWrench className="w-8 h-8 text-white animate-spin-slow" />,
    title: "Coming Soon: Extra DSA Tool",
    desc: "We’re working on an additional visualizer—stay tuned!",
    bullets: null,
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-gradient-to-br from-slate-50 to-slate-200 overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[70vw] h-[60vw] pointer-events-none bg-gradient-to-tr from-blue-100/60 to-green-200/30 rounded-full opacity-30 blur-3xl -z-10 -translate-x-1/2" />

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-16 drop-shadow"
        >
          About the Projects
        </motion.h2>

        <div className="grid gap-10 sm:grid-cols-2">
          {aboutItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.7, type: "spring", bounce: 0.2 }}
              viewport={{ once: true }}
              className="group bg-white/80 backdrop-blur-lg relative border border-gray-100 shadow-xl rounded-2xl p-8 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/90"
            >
              {/* Floating gradient icon */}
              <div className={`absolute -top-6 left-6 shadow-lg rounded-full p-2 bg-gradient-to-tr ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>

              <h3 className={`text-2xl font-bold mb-2 mt-6 text-transparent bg-clip-text bg-gradient-to-tr ${item.color}`}>
                {item.title}
              </h3>
              <p className="text-gray-700 mb-3">{item.desc}</p>
              {item.bullets && (
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {item.bullets.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
