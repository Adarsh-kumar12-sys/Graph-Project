
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
