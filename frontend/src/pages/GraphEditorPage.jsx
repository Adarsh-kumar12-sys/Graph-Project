import React, { useState } from "react";
import { useNodesState, useEdgesState } from "react-flow-renderer";
import GraphEditor from "../components/GraphEditor";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const GraphEditorPage = () => {
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

  const { isLoggedIn, token } = useAuth();

  // const API_BASE_URL = import.meta.env.VITE_API_URL;
  // http://localhost:5000/api/dijkstra
  const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000'; // Fallback to local server if env variable not set
  // const API_BASE_URL = "http://localhost:5000";

  // Add Node
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

  // Clear graph
  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setResults(null);
  };

  // Run Dijkstra
  const runDijkstra = async () => {
    if (!source || (mode === "single" && !target)) {
      alert("Please select source and target (if single mode)");
      return;
    }

    const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
    const nodeIds = nodes.map((n) => n.id);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/dijkstra`, {
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

  // Save graph - open prompt
  const saveGraph = () => {
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

  // Confirm save graph
  const confirmSaveGraph = async () => {
    setSaving(true);
    const formattedEdges = edges.map((e) => [e.source, e.target, parseInt(e.label)]);
    const nodeIds = nodes.map((n) => n.id);

    try {
      await axios.post(`${API_BASE_URL}/api/graphs/save`,
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

  // Cancel save graph
  const cancelSaveGraph = () => {
    setShowNamePrompt(false);
    setGraphName("");
  };

  // Fetch saved graphs
  const fetchGraphs = async () => {
    if (!isLoggedIn) {
      alert("Please log in to load saved graphs.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/graphs/my-graphs`, {
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

  // Delete graph
  const deleteGraph = async (id) => {
    if (!window.confirm("Are you sure you want to delete this graph?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/graphs/delete/${id}`, {
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

  // Load saved graph into editor
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
    <GraphEditor
      nodes={nodes}
      setNodes={setNodes}
      onNodesChange={onNodesChange}
      edges={edges}
      setEdges={setEdges}
      onEdgesChange={onEdgesChange}
      source={source}
      setSource={setSource}
      target={target}
      setTarget={setTarget}
      mode={mode}
      setMode={setMode}
      results={results}
      setResults={setResults}
      savedGraphs={savedGraphs}
      setSavedGraphs={setSavedGraphs}
      showNamePrompt={showNamePrompt}
      setShowNamePrompt={setShowNamePrompt}
      graphName={graphName}
      setGraphName={setGraphName}
      saving={saving}
      setSaving={setSaving}
      isFullscreen={isFullscreen}
      setIsFullscreen={setIsFullscreen}
      addNode={addNode}
      clearGraph={clearGraph}
      runDijkstra={runDijkstra}
      saveGraph={saveGraph}
      fetchGraphs={fetchGraphs}
      confirmSaveGraph={confirmSaveGraph}
      cancelSaveGraph={cancelSaveGraph}
      deleteGraph={deleteGraph}
      loadGraph={loadGraph}
    />
  );
};

export default GraphEditorPage;
