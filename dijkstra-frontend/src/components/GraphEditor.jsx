

import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const GraphEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState("all");
  const [results, setResults] = useState(null);
  const [savedGraphs, setSavedGraphs] = useState([]);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [graphName, setGraphName] = useState("");
  const [saving, setSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { isLoggedIn, token, username } = useAuth();

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

  const addNode = () => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      data: { label: `Node ${id}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      style: { border: "1px solid #777", padding: 10, borderRadius: 8 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setResults(null);
  };

  const runDijkstra = async () => {
    if (!source || (mode === "single" && !target)) {
      alert("Please select source and target (if single mode)");
      return;
    }

    const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
    const nodeIds = nodes.map((n) => n.id);

    try {
      const res = await axios.post("http://localhost:5000/api/dijkstra", {
        nodes: nodeIds,
        edges: formattedEdges,
        source,
        target: mode === "single" ? target : null,
        mode,
      });

      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error running Dijkstra");
    }
  };

  const saveGraph = async () => {
    if (!isLoggedIn) {
      alert("Please log in to save your graph.");
      return;
    }

    if (!source) {
      alert("Please select a source node before saving.");
      return;
    }

    setShowNamePrompt(true);
  };

  const confirmSaveGraph = async () => {
    setSaving(true);
    const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
    const nodeIds = nodes.map((n) => n.id);

    try {
      await axios.post(
        "http://localhost:5000/api/graphs/save",
        {
          name: graphName,
          nodes: nodeIds,
          edges: formattedEdges,
          source,
          target: mode === "single" ? target : null,
          mode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowNamePrompt(false);
      setGraphName("");
      alert("Graph saved successfully!");
      fetchGraphs();
    } catch (err) {
      console.error(err);
      alert("Error saving graph");
    } finally {
      setSaving(false);
    }
  };

  const cancelSaveGraph = () => {
    setShowNamePrompt(false);
    setGraphName("");
  };

  const fetchGraphs = async () => {
    if (!isLoggedIn) {
      alert("Please log in to load saved graphs.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/graphs/my-graphs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedGraphs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch saved graphs");
    }
  };

  const deleteGraph = async (id) => {
    if (!window.confirm("Are you sure you want to delete this graph?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/graphs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedGraphs((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete graph");
    }
  };

  const loadGraph = (graph) => {
    setNodes(
      graph.nodes.map((id) => ({
        id,
        data: { label: `Node ${id}` },
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        style: { border: "1px solid #777", padding: 10, borderRadius: 8 },
      }))
    );

    setEdges(
      graph.edges.map(([src, tgt, label]) => ({
        id: `${src}-${tgt}`,
        source: src,
        target: tgt,
        label: String(label),
        animated: true,
        data: { weight: parseInt(label) },
        style: { stroke: "#555" },
      }))
    );

    setSource(graph.source || "");
    setTarget(graph.target || "");
    setMode(graph.mode || "all");

    alert("Graph loaded");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col">
      {/* Name prompt modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-11/12 max-w-md border border-slate-200">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Name your graph</h3>
            <input
              type="text"
              value={graphName}
              onChange={e => setGraphName(e.target.value)}
              className="border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-2 w-full mb-6 rounded-lg shadow-sm transition"
              placeholder="Graph name"
              disabled={saving}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelSaveGraph}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveGraph}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-blue-700 transition font-semibold disabled:opacity-60"
                disabled={saving || !graphName.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full px-4 py-5 bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-md">Dijkstra Visualizer</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-medium hidden sm:inline">Welcome, {username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-900 text-white px-4 py-2 rounded-lg shadow font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition">
                Login
              </a>
              <a href="/signup" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition">
                Signup
              </a>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <section className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Controls */}
          <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={addNode} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Add Node</button>
              <button onClick={clearGraph} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Clear</button>
              <button onClick={saveGraph} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition disabled:opacity-50" disabled={!isLoggedIn}>Save</button>
              <button onClick={fetchGraphs} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition disabled:opacity-50" disabled={!isLoggedIn}>Load Saved</button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="font-semibold text-slate-700">Mode:</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="border rounded px-3 py-2">
                <option value="all">All Paths</option>
                <option value="single">Single Target</option>
              </select>
              <label className="font-semibold text-slate-700">Source:</label>
              <select value={source} onChange={e => setSource(e.target.value)} className="border rounded px-3 py-2">
                <option value="">Select</option>
                {nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
              </select>
              {mode === "single" && (
                <>
                  <label className="font-semibold text-slate-700">Target:</label>
                  <select value={target} onChange={e => setTarget(e.target.value)} className="border rounded px-3 py-2">
                    <option value="">Select</option>
                    {nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
                  </select>
                </>
              )}
              <button onClick={runDijkstra} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition">Run Dijkstra</button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/90 rounded-2xl shadow-xl border p-6 h-72 overflow-y-auto">
            <h2 className="text-lg font-bold mb-3 text-indigo-700">Dijkstra Output</h2>
            {results ? (
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(results.distances).map(([node, data]) => (
                  <li key={node}>
                    <span className="font-semibold text-indigo-600">To Node {node}:</span> Distance = {data.cost}, Path = {data.path?.join(" ➜ ") || "N/A"}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">Run the algorithm to see output.</p>}
          </div>

          {/* Saved Graphs */}
          {savedGraphs.length > 0 && (
            <div className="bg-white/90 rounded-2xl shadow-xl border p-6">
              <h3 className="text-md font-bold mb-3 text-indigo-700">Your Saved Graphs</h3>
              <ul className="space-y-2">
                {savedGraphs.map((graph, idx) => (
                  <li key={graph._id} className="flex items-center justify-between">
                    <button onClick={() => loadGraph(graph)} className="text-blue-700 font-semibold hover:underline">
                      {graph.name || `Graph #${idx + 1}`} ({graph.nodes.length} nodes, {graph.edges.length} edges)
                    </button>
                    <button onClick={() => deleteGraph(graph._id)} className="text-red-600 text-sm">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right Panel - Graph */}
        <section className="flex-1 min-h-[400px]">
          <div className="relative h-[60vh] md:h-[70vh] w-full bg-white/80 rounded-2xl shadow-2xl border overflow-hidden">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 right-3 z-20 bg-indigo-600 text-white px-3 py-1 rounded shadow hover:bg-indigo-700 transition"
              style={{ display: isFullscreen ? 'none' : 'block' }}
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
          <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
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

// k