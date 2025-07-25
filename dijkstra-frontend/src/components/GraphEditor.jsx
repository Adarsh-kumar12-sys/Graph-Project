

// import React, { useCallback, useState } from "react";
// import ReactFlow, {
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
// } from "react-flow-renderer";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const GraphEditor = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [source, setSource] = useState("");
//   const [target, setTarget] = useState("");
//   const [mode, setMode] = useState("all");
//   const [results, setResults] = useState(null);
//   const [savedGraphs, setSavedGraphs] = useState([]);
//   const [showNamePrompt, setShowNamePrompt] = useState(false);
//   const [graphName, setGraphName] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const { isLoggedIn, token, username } = useAuth();

//   const onConnect = useCallback(
//     (params) => {
//       const weight = prompt("Enter weight for this edge:");
//       if (!weight) return;
//       const newEdge = {
//         ...params,
//         id: `${params.source}-${params.target}`,
//         label: weight,
//         animated: true,
//         data: { weight: parseInt(weight) },
//         style: { stroke: "#555" },
//       };
//       setEdges((eds) => addEdge(newEdge, eds));
//     },
//     [setEdges]
//   );

//   const addNode = () => {
//     const id = (nodes.length + 1).toString();
//     const newNode = {
//       id,
//       data: { label: `Node ${id}` },
//       position: { x: Math.random() * 300, y: Math.random() * 300 },
//       style: { border: "1px solid #777", padding: 10, borderRadius: 8 },
//     };
//     setNodes((nds) => [...nds, newNode]);
//   };

//   const clearGraph = () => {
//     setNodes([]);
//     setEdges([]);
//     setResults(null);
//   };

//   const runDijkstra = async () => {
//     if (!source || (mode === "single" && !target)) {
//       alert("Please select source and target (if single mode)");
//       return;
//     }

//     const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
//     const nodeIds = nodes.map((n) => n.id);

//     try {
//       const res = await axios.post("http://localhost:5000/api/dijkstra", {
//         nodes: nodeIds,
//         edges: formattedEdges,
//         source,
//         target: mode === "single" ? target : null,
//         mode,
//       });

//       setResults(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error running Dijkstra");
//     }
//   };

//   const saveGraph = async () => {
//     if (!isLoggedIn) {
//       alert("Please log in to save your graph.");
//       return;
//     }

//     if (!source) {
//       alert("Please select a source node before saving.");
//       return;
//     }

//     setShowNamePrompt(true);
//   };

//   const confirmSaveGraph = async () => {
//     setSaving(true);
//     const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
//     const nodeIds = nodes.map((n) => n.id);

//     try {
//       await axios.post(
//         "http://localhost:5000/api/graphs/save",
//         {
//           name: graphName,
//           nodes: nodeIds,
//           edges: formattedEdges,
//           source,
//           target: mode === "single" ? target : null,
//           mode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setShowNamePrompt(false);
//       setGraphName("");
//       alert("Graph saved successfully!");
//       fetchGraphs();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving graph");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cancelSaveGraph = () => {
//     setShowNamePrompt(false);
//     setGraphName("");
//   };

//   const fetchGraphs = async () => {
//     if (!isLoggedIn) {
//       alert("Please log in to load saved graphs.");
//       return;
//     }

//     try {
//       const res = await axios.get("http://localhost:5000/api/graphs/my-graphs", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSavedGraphs(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch saved graphs");
//     }
//   };

//   const deleteGraph = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this graph?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/graphs/delete/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSavedGraphs((prev) => prev.filter((g) => g._id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete graph");
//     }
//   };

//   const loadGraph = (graph) => {
//     setNodes(
//       graph.nodes.map((id) => ({
//         id,
//         data: { label: `Node ${id}` },
//         position: { x: Math.random() * 300, y: Math.random() * 300 },
//         style: { border: "1px solid #777", padding: 10, borderRadius: 8 },
//       }))
//     );

//     setEdges(
//       graph.edges.map(([src, tgt, label]) => ({
//         id: `${src}-${tgt}`,
//         source: src,
//         target: tgt,
//         label: String(label),
//         animated: true,
//         data: { weight: parseInt(label) },
//         style: { stroke: "#555" },
//       }))
//     );

//     setSource(graph.source || "");
//     setTarget(graph.target || "");
//     setMode(graph.mode || "all");

//     alert("Graph loaded");
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col">
//       {/* Name prompt modal */}
//       {showNamePrompt && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-11/12 max-w-md border border-slate-200">
//             <h3 className="text-xl font-bold mb-4 text-indigo-700">Name your graph</h3>
//             <input
//               type="text"
//               value={graphName}
//               onChange={e => setGraphName(e.target.value)}
//               className="border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-2 w-full mb-6 rounded-lg shadow-sm transition"
//               placeholder="Graph name"
//               disabled={saving}
//               autoFocus
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={cancelSaveGraph}
//                 className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmSaveGraph}
//                 className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-blue-700 transition font-semibold disabled:opacity-60"
//                 disabled={saving || !graphName.trim()}
//               >
//                 {saving ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <header className="w-full px-4 py-5 bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <span className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-md">Dijkstra Visualizer</span>
//         </div>
//         <div className="flex items-center gap-3">
//           {isLoggedIn ? (
//             <>
//               <span className="text-gray-700 font-medium hidden sm:inline">Welcome, {username}</span>
//               <button
//                 onClick={() => {
//                   localStorage.removeItem("token");
//                   window.location.reload();
//                 }}
//                 className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-900 text-white px-4 py-2 rounded-lg shadow font-semibold transition"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <a href="/login" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition">
//                 Login
//               </a>
//               <a href="/signup" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition">
//                 Signup
//               </a>
//             </>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
//         {/* Left Panel */}
//         <section className="w-full lg:w-1/3 flex flex-col gap-6">
//           {/* Controls */}
//           <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col gap-4">
//             <div className="flex flex-wrap gap-2 mb-2">
//               <button onClick={addNode} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Add Node</button>
//               <button onClick={clearGraph} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Clear</button>
//               <button onClick={saveGraph} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition disabled:opacity-50" disabled={!isLoggedIn}>Save</button>
//               <button onClick={fetchGraphs} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition disabled:opacity-50" disabled={!isLoggedIn}>Load Saved</button>
//             </div>
//             <div className="flex flex-wrap gap-3 items-center">
//               <label className="font-semibold text-slate-700">Mode:</label>
//               <select value={mode} onChange={e => setMode(e.target.value)} className="border rounded px-3 py-2">
//                 <option value="all">All Paths</option>
//                 <option value="single">Single Target</option>
//               </select>
//               <label className="font-semibold text-slate-700">Source:</label>
//               <select value={source} onChange={e => setSource(e.target.value)} className="border rounded px-3 py-2">
//                 <option value="">Select</option>
//                 {nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
//               </select>
//               {mode === "single" && (
//                 <>
//                   <label className="font-semibold text-slate-700">Target:</label>
//                   <select value={target} onChange={e => setTarget(e.target.value)} className="border rounded px-3 py-2">
//                     <option value="">Select</option>
//                     {nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
//                   </select>
//                 </>
//               )}
//               <button onClick={runDijkstra} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Run Dijkstra</button>
//             </div>
//           </div>

//           {/* Output */}
//           <div className="bg-white/90 rounded-2xl shadow-xl border p-6 h-72 overflow-y-auto">
//             <h2 className="text-lg font-bold mb-3 text-indigo-700">Dijkstra Output</h2>
//             {results ? (
//               <ul className="list-disc pl-4 text-sm">
//                 {Object.entries(results.distances).map(([node, data]) => (
//                   <li key={node}>
//                     <span className="font-semibold text-indigo-600">To Node {node}:</span> Distance = {data.cost}, Path = {data.path?.join(" ➜ ") || "N/A"}
//                   </li>
//                 ))}
//               </ul>
//             ) : <p className="text-sm text-gray-400">Run the algorithm to see output.</p>}
//           </div>

//           {/* Saved Graphs */}
//           {savedGraphs.length > 0 && (
//             <div className="bg-white/90 rounded-2xl shadow-xl border p-6">
//               <h3 className="text-md font-bold mb-3 text-indigo-700">Your Saved Graphs</h3>
//               <ul className="space-y-2">
//                 {savedGraphs.map((graph, idx) => (
//                   <li key={graph._id} className="flex items-center justify-between">
//                     <button onClick={() => loadGraph(graph)} className="text-blue-700 font-semibold hover:underline">
//                       {graph.name || `Graph #${idx + 1}`} ({graph.nodes.length} nodes, {graph.edges.length} edges)
//                     </button>
//                     <button onClick={() => deleteGraph(graph._id)} className="text-red-600 text-sm">Delete</button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </section>

//         {/* Right Panel - Graph */}
//         <section className="flex-1 min-h-[400px]">
//           <div className="relative h-[60vh] md:h-[70vh] w-full bg-white/80 rounded-2xl shadow-2xl border overflow-hidden">
//             {/* Fullscreen Toggle Button */}
//             <button
//               onClick={() => setIsFullscreen(true)}
//               className="absolute top-3 right-3 z-20 bg-indigo-600 text-white px-3 py-1 rounded shadow hover:bg-indigo-700 transition"
//               style={{ display: isFullscreen ? 'none' : 'block' }}
//               title="Expand to Fullscreen"
//             >
//               ⛶ Fullscreen
//             </button>
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={onConnect}
//               fitView
//             >
//               <MiniMap />
//               <Controls />
//               <Background />
//             </ReactFlow>
//           </div>
//         </section>

//         {/* Fullscreen React Flow Overlay */}
//         {isFullscreen && (
//           <div className="fixed inset-0 z-50 bg-white flex flex-col">
//             <div className="absolute top-4 right-4 z-50">
//               <button
//                 onClick={() => setIsFullscreen(false)}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
//                 title="Exit Fullscreen"
//               >
//                 ✕ Minimize
//               </button>
//             </div>
//             <div className="flex-1">
//               <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 fitView
//               >
//                 <MiniMap />
//                 <Controls />
//                 <Background />
//               </ReactFlow>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default GraphEditor;



import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";
import { useAuth } from "../context/AuthContext";
import { FaHome } from "react-icons/fa";


const GraphEditor = ({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  source,
  setSource,
  target,
  setTarget,
  mode,
  setMode,
  results,
  setResults,
  savedGraphs,
  setSavedGraphs,
  showNamePrompt,
  setShowNamePrompt,
  graphName,
  setGraphName,
  saving,
  setSaving,
  isFullscreen,
  setIsFullscreen,
  addNode,
  clearGraph,
  runDijkstra,
  saveGraph,
  fetchGraphs,
  confirmSaveGraph,
  cancelSaveGraph,
  deleteGraph,
  loadGraph,
}) => {
  const { isLoggedIn, username } = useAuth();

  // onConnect handler with prompt for weight
  const onConnect = useCallback(
    (params) => {
      const weight = prompt("Enter weight for this edge:");
      if (!weight) return;
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        label: weight,
        animated: true,
        data: { weight: parseInt(weight) },
        style: { stroke: "#555" },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#4338ca] via-[#a5b4fc] to-[#f3f4f6] flex flex-col">
      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[95vw] max-w-lg border border-indigo-200 animate-fade-in-up">
            <h3 className="text-2xl font-black mb-4 text-indigo-700 tracking-tight">
              Name Your Graph
            </h3>
            <input
              type="text"
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              className="border-2 border-indigo-200 focus:ring-4 focus:ring-indigo-300 px-4 py-2 w-full mb-6 rounded-xl shadow-inner bg-indigo-50/50 transition"
              placeholder="Enter graph name"
              disabled={saving}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelSaveGraph}
                className="px-5 py-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 transition hover:scale-105"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveGraph}
                className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2 rounded-xl shadow-xl font-bold hover:from-indigo-800 hover:to-pink-700 transform-gpu active:scale-95 transition-all disabled:opacity-60"
                disabled={saving || !graphName.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full px-6 py-6 bg-white/70 backdrop-blur-lg border-b border-indigo-100 shadow-xl flex items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-0">
          {/* Home Icon - leftmost */}
          <button
            className="p-2 bg-white/80 hover:bg-indigo-100 text-indigo-600 shadow-md rounded-full transition"
            title="Go to Home"
            onClick={() => window.location.href = '/'}
            aria-label="Home"
          >
            <FaHome className="w-6 h-6" />
          </button>
          {/* Small space then title */}
          <span className="ml-20 text-4xl font-black text-indigo-700 tracking-tight drop-shadow-2xl animate-gradient bg-gradient-to-r from-indigo-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Dijkstra Visualizer
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-slate-700 font-semibold hidden sm:inline">
                Hello, {username}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-gradient-to-br from-indigo-700 to-blue-700 text-white px-5 py-2 rounded-xl shadow-2xl font-bold transition hover:from-indigo-900 hover:-translate-y-1 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-5 py-2 rounded-xl shadow-lg font-bold transition hover:from-indigo-800 hover:to-blue-700"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-5 py-2 rounded-xl shadow-lg font-bold transition hover:from-cyan-700 hover:to-green-700"
              >
                Signup
              </a>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Panel */}
        <section className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* Controls */}
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-7 flex flex-col gap-6 backdrop-blur animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={addNode}
                className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md font-bold transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                + Add Node
              </button>
              <button
                onClick={clearGraph}
                className="bg-gradient-to-tr from-red-500 via-pink-500 to-fuchsia-500 text-white px-4 py-2 rounded-xl shadow-md font-bold transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Clear
              </button>
              <button
                onClick={saveGraph}
                className="bg-gradient-to-tr from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md font-bold transition disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-xl"
                disabled={!isLoggedIn}
              >
                Save
              </button>
              <button
                onClick={fetchGraphs}
                className="bg-gradient-to-tr from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-xl shadow-md font-bold transition disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-xl"
                disabled={!isLoggedIn}
              >
                Load Saved
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-center text-base font-medium">
              <label className="font-semibold text-indigo-700">Mode:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border-2 border-indigo-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 font-semibold"
              >
                <option value="all">All Paths</option>
                <option value="single">Single Target</option>
              </select>

              {/* <label className="font-semibold text-indigo-700">Source:</label> */}
              <label className="font-bold text-violet-700 ml-0">Source:</label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  className="border-2 border-violet-200 rounded px-3 py-2 focus:ring-2 focus:ring-pink-300 bg-white/70 font-semibold"
                >
                  <option value="">Select</option>
                  {nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
                </select>
              {mode === "single" && (
                <>
                  <label className="font-semibold text-indigo-700">Target:</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="border-2 border-indigo-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 font-semibold"
                  >
                    <option value="">Select</option>
                    {nodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.id}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <button
                onClick={runDijkstra}
                className="bg-gradient-to-tr from-purple-700 to-indigo-600 text-white px-5 py-2 rounded-xl shadow font-bold ml-3 hover:-translate-y-0.5 hover:shadow-xl transition"
              >
                Run Dijkstra
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/80 rounded-3xl shadow-xl border border-indigo-100 p-7 h-72 overflow-y-auto">
            <h2 className="text-xl font-black mb-4 text-indigo-600 tracking-wide">
              Dijkstra Output
            </h2>
            {results ? (
              <ul className="list-disc pl-5 text-base space-y-1">
                {Object.entries(results.distances).map(([node, data]) => (
                  <li key={node}>
                    <span className="font-semibold text-indigo-700">
                      To Node {node}:
                    </span>{" "}
                    <span className="text-slate-800">
                      Distance = {data.cost}, Path = {data.path?.join(" ➜ ") || "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-gray-400">Run the algorithm to see output.</p>
            )}
          </div>

          {/* Saved Graphs */}
          {savedGraphs.length > 0 && (
            <div className="bg-white/80 rounded-3xl shadow-xl border border-indigo-100 p-7 animate-fade-in">
              <h3 className="text-lg font-bold mb-3 text-indigo-700">Your Saved Graphs</h3>
              <ul className="space-y-2">
                {savedGraphs.map((graph, idx) => (
                  <li
                    key={graph._id}
                    className="flex items-center justify-between group"
                  >
                    <button
                      onClick={() => loadGraph(graph)}
                      className="text-indigo-700 font-semibold hover:underline hover:text-blue-600 transition-all"
                    >
                      {graph.name || `Graph #${idx + 1}`}{" "}
                      <span className="text-xs text-gray-500">
                        ({graph.nodes.length} nodes, {graph.edges.length} edges)
                      </span>
                    </button>
                    <button
                      onClick={() => deleteGraph(graph._id)}
                      className="text-pink-600 text-sm font-bold opacity-80 hover:opacity-100 hover:scale-110 transition-all"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right Panel - Graph */}
        <section className="flex-1 min-h-[400px]">
          <div className="relative h-[60vh] md:h-[72vh] w-full bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 z-20 bg-violet-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition font-bold"
                style={{ display: isFullscreen ? "none" : "block" }}
                title="Expand to Fullscreen"
              >
                ⛶ Fullscreen
              </button>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>

        </section>

        {/* Fullscreen React Flow Overlay */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-gradient-to-bl from-white via-indigo-100 to-blue-200 flex flex-col animate-fade-in-up">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-gradient-to-tr from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-2xl shadow font-bold hover:from-indigo-900 hover:to-blue-800 transition-all"
                title="Exit Fullscreen"
              >
                ✕ Minimize
              </button>
            </div>
            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GraphEditor;
