// src/pages/MstEditor.jsx
import React, { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import axios from 'axios';
import 'reactflow/dist/style.css';
import { useAuth } from "../context/AuthContext";


import ControlPanel from '../components/ControlPanel';
import GraphDisplay from '../components/GraphDisplay';

const MstEditor = () => {
 const { token, isLoggedIn, username } = useAuth(); // Line ~9
// Correctly placed inside the component

  const [nodeCounter, setNodeCounter] = useState(0);
  const [edgeCounter, setEdgeCounter] = useState(0);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mstResult, setMstResult] = useState({ edges: [], cost: 0 });

  const getNewNodeId = useCallback(() => {
    const id = `node-${nodeCounter}`;
    setNodeCounter(prev => prev + 1);
    return id;
  }, [nodeCounter]);

  const getNewEdgeId = useCallback(() => {
    const id = `edge-${edgeCounter}`;
    setEdgeCounter(prev => prev + 1);
    return id;
  }, [edgeCounter]);

  const handleAddNode = useCallback(() => {
    const id = getNewNodeId();
    const newNode = {
      id,
      data: { label: `Node ${id.split('-')[1]}` },
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      style: { border: '1px solid #777', padding: 10, borderRadius: 5 },
    };
    setNodes(nds => [...nds, newNode]);
  }, [getNewNodeId, setNodes]);

  const onConnect = useCallback(
    (params) => {
      const weight = prompt("Enter weight for this edge:");
      if (weight === null || isNaN(parseInt(weight)) || weight.trim() === '') {
        alert('Invalid or no weight entered. Edge not created.');
        return;
      }

      const existingEdge = edges.find(
        (e) =>
          (e.source === params.source && e.target === params.target) ||
          (e.source === params.target && e.target === params.source)
      );
      if (existingEdge) {
        alert('An edge already exists between these two nodes.');
        return;
      }

      const newEdge = {
        ...params,
        id: getNewEdgeId(),
        label: `W: ${weight}`,
        data: { weight: parseInt(weight) },
        type: 'default',
        animated: false,
        style: { stroke: '#b1b1b7', strokeWidth: 1 },
      };
      setEdges(eds => addEdge(newEdge, eds));
    },
    [edges, setEdges, getNewEdgeId]
  );

  const handleAddEdge = useCallback((sourceId, targetId, weight) => {
    if (!sourceId || !targetId || isNaN(weight)) {
      alert('Invalid edge data.');
      return;
    }

    const existingEdge = edges.find(
      (e) =>
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
    );
    if (existingEdge) {
      alert('An edge already exists between these nodes.');
      return;
    }

    const newEdge = {
      id: getNewEdgeId(),
      source: sourceId,
      target: targetId,
      label: `W: ${weight}`,
      data: { weight: parseInt(weight) },
      type: 'default',
      animated: false,
      style: { stroke: '#b1b1b7', strokeWidth: 1 },
    };
    setEdges(eds => addEdge(newEdge, eds));
  }, [edges, setEdges, getNewEdgeId]);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setMstResult({ edges: [], cost: 0 });
    setNodeCounter(0);
    setEdgeCounter(0);
  }, []);

  const handleDesignNetwork = useCallback(async () => {
    if (nodes.length === 0 || edges.length === 0) {
      alert("Add nodes and edges before running MST.");
      return;
    }

    const graphData = {
  nodes: nodes.map(n => n.id),
  edges: edges.map(e => ({
    from: e.source,
    to: e.target,
    weight: e.data?.weight || 1,
  })),
};


    try {
      console.log("Auth token from context:",token);
      console.log("Graph data being sent:", graphData);

      const response = await axios.post(
  "http://localhost:5000/api/mst/calculate",
 graphData,
  {
    headers: {
     Authorization: `Bearer ${token}`, // `auth` is used here
    },
  }
);

     const { mst, cost } = response.data;

const mstEdgeIds = new Set(mst.map(e => e.id)); // if e.id exists, or use some unique identifier
const styledEdges = edges.map(e => {
  const isMst = mstEdgeIds.has(e.id);
  return {
    ...e,
    animated: isMst,
    style: {
      stroke: isMst ? '#6f42c1' : '#b1b1b7',
      strokeWidth: isMst ? 3 : 1
    }
  };
});

setEdges(styledEdges);
setMstResult({ edges: mst, cost }); // also match 'mstResult.cost'
alert(`MST calculated. Total cost: ${cost}`);

    } catch (err) {
      console.error("MST error:", err);
      alert("Failed to compute MST. Check backend or console.");
    }
}, [nodes, edges, token]);// FIX: Added `auth` to the dependency array

  const handleSave = useCallback(() => {
    const dataToSave = { nodes, edges, nodeCounter, edgeCounter };
    localStorage.setItem('mstGraphData', JSON.stringify(dataToSave));
    alert('Graph saved locally.');
  }, [nodes, edges, nodeCounter, edgeCounter]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('mstGraphData');
    if (!saved) return alert('No saved graph.');
    const parsed = JSON.parse(saved);
    setNodes(parsed.nodes || []);
    setEdges(parsed.edges || []);
    setNodeCounter(parsed.nodeCounter || 0);
    setEdgeCounter(parsed.edgeCounter || 0);
    alert('Graph loaded.');
  }, []);

  return (
    <div style={appStyles.container}>
      <div style={appStyles.header}>
        <h1 style={appStyles.headerTitle}>Prim's MST Visualizer</h1>
        <div style={appStyles.userInfo}>
  {isLoggedIn ? (
    <>
      <span>Welcome, {username}</span>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={appStyles.logoutButton}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <a
        href="/login"
        style={{
          padding: '8px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Login
      </a>
      <a
        href="/signup"
        style={{
          padding: '8px 15px',
          backgroundColor: '#28a745',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Signup
      </a>
    </>
  )}
</div>

      </div>

      <div style={appStyles.mainContent}>
        <ControlPanel
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onClear={handleClear}
          onSave={handleSave}
          onLoad={handleLoad}
          onDesignNetwork={handleDesignNetwork}
          mstResult={mstResult}
          nodes={nodes}
        />
        <GraphDisplay
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          mstEdges={mstResult.edges}
        />
      </div>
    </div>
  );
};

const appStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#343a40',
    color: 'white',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5em',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoutButton: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    flexGrow: 1,
    padding: '20px',
    gap: '20px',
  },
};

export default MstEditor;