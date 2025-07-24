// src/pages/MstEditor.jsx
import React, { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import axios from 'axios';
import 'reactflow/dist/style.css';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { greenToast } from '../utils/toastStyles';
import { redToast } from '../utils/toastStyles';

import ControlPanel from '../components/ControlPanel';
import GraphDisplay from '../components/GraphDisplay';
import PromptDialog from '../components/PromptDialog'; // adjust path

const getRandomPosition = () => ({
  x: Math.random() * 400 + 50, // These values should match what you use in handleAddNode
  y: Math.random() * 400 + 50, // Adjust range as needed for initial placement
});

const MstEditor = () => {
  const { token, isLoggedIn, username } = useAuth(); // Line ~9
  const navigate = useNavigate();
  // Correctly placed inside the component

  const [nodeCounter, setNodeCounter] = useState(0);
  const [edgeCounter, setEdgeCounter] = useState(0);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mstResult, setMstResult] = useState({ edges: [], cost: 0 });
  const [showPrompt, setShowPrompt] = useState(false);
const [addNodePromptVisible, setAddNodePromptVisible] = useState(false);




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
const handleAddNodeNameSubmit = (nameInput) => {
  const name = nameInput && nameInput.trim() ? nameInput.trim() : `Node`;
  const id = getNewNodeId();
  const newNode = {
    id,
    data: { label: name },
    position: {
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
    },
    style: {
      border: '1px solid #777',
      padding: 10,
      borderRadius: 5,
    },
  };
  setNodes((nds) => [...nds, newNode]);
  setAddNodePromptVisible(false);
};

 const handleAddNode = useCallback(() => {
  setAddNodePromptVisible(true);
}, []);



  const onConnect = useCallback(
    (params) => {
      const weight = prompt("Enter weight for this edge:");
      if (weight === null || isNaN(parseInt(weight)) || weight.trim() === '') {
        toast("Invalid or no weight entered. Edge not created.", redToast);
        return;
      }

      const existingEdge = edges.find(
        (e) =>
          (e.source === params.source && e.target === params.target) ||
          (e.source === params.target && e.target === params.source)
      );
      if (existingEdge) {
        toast("An edge already exists between these two nodes.", redToast);
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
      toast("Invalid edge data.", redToast);
      return;
    }

    const existingEdge = edges.find(
      (e) =>
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
    );
    if (existingEdge) {
      toast("An edge already exists between these nodes.", redToast);
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
      toast("Add nodes and edges before running MST.", redToast);
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
      // console.log("Auth token from context:", token);
      // console.log("Graph data being sent:", graphData);

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
      toast(`MST calculated. Total cost: ${cost}`, greenToast);

    } catch (err) {
      console.error("MST error:", err);
      toast("Failed to compute MST. Check backend or console.", redToast);
    }
  }, [nodes, edges, token]);// FIX: Added `auth` to the dependency array

 const handlePromptSubmit = async (value) => {
  if (!value.trim()) {
    toast("Design name cannot be empty.", redToast);
    return;
  }

  

  if (!mstResult || !mstResult.edges || typeof mstResult.cost !== 'number') {
    toast("Run Prim's algorithm first to compute MST.", redToast);
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/mstDesign', {
      name: value,
      nodes: nodes.map(n => ({
        id: n.id,
        label: n.data.label,
        type: 'node'
      })),
      edges: edges.map(e => ({
        from: e.source,
        to: e.target,
        cost: Number(e.data?.weight || e.label || 1)
      })),
      computedMST: {
        edges: mstResult.edges.map(e => ({
          from: e.from,
          to: e.to,
          cost: Number(e.cost || e.weight || e.label || 1)
        })),
        totalCost: mstResult.cost
      }

    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast("Design saved successfully!", greenToast);
  } catch (err) {
    console.error("Failed to save design:", err);
    toast("Failed to save design. Check console or backend.", redToast);
  }

  setShowPrompt(false);
};


  const handleSave = useCallback(() => {
  setShowPrompt(true); // just opens prompt
}, []);

    


  const handleLoad = useCallback(async (designId) => {
    if (!designId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/mst/designs/${designId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Loaded design:", response);

      const design = response.data;




      // 1. Transform Nodes
      const transformedNodes = design.nodes.map(node => {
        // Ensure ID is present, if not, skip or assign new one
        if (!node.id) {
          console.warn("Skipping node from loaded design due to missing ID:", node);
          return null; // Or generate a new ID: getNewNodeId()
        }

        const position = getRandomPosition();

        return {
          id: node.id,
          position: position,
          data: {
            label: node.label || `Node ${node.id}`, // Use existing label, or fallback
            type: node.type || 'default', // Your saved data has 'type', put it in 'data'
          },

          type: 'default', // Assuming all loaded nodes are 'default' React Flow nodes
          style: { border: '1px solid #777', padding: 10, borderRadius: 5 }, // Apply default styles
        };
      }).filter(Boolean); // Remove any nulls if nodes were skipped

      // 2. Transform Edges
      const transformedEdges = design.edges.map(edge => {
        // Ensure 'from' and 'to' are present
        if (!edge.from || !edge.to) {
          console.warn("Skipping edge from loaded design due to missing 'from' or 'to':", edge);
          return null;
        }
        return {

          id: edge._id || `e-${edge.from}-${edge.to}-${edge.cost || ''}-${Math.random().toString(36).substring(7)}`,
          source: edge.from,
          target: edge.to,
          label: `W: ${edge.cost || 1}`, // Ensure label is string, fallback to 1
          data: { weight: edge.cost || 1 }, // Store original weight in data
          type: 'default', // Assuming default edge type
          animated: false, // Default animation state
          style: { stroke: '#b1b1b7', strokeWidth: 1 }, // Default edge style
        };
      }).filter(Boolean); // Remove any nulls if edges were skipped


      // 3. Set States with Transformed Data
      setNodes(transformedNodes);
      setEdges(transformedEdges);

      // 4. Update Counters
      // Calculate nodeCounter based on the highest existing node ID
      const maxNodeIdNum = transformedNodes.reduce((max, node) => {
        const num = parseInt(node.id.replace('node-', ''));
        return isNaN(num) ? max : Math.max(max, num);
      }, -1); // Start from -1 to handle empty arrays correctly
      setNodeCounter(maxNodeIdNum + 1);

      // Calculate edgeCounter based on the number of edges (or parse if IDs have counters)
      setEdgeCounter(transformedEdges.length);


      // 5. Set MST Result (if present in saved design)
      if (design.computedMST) {
        setMstResult({
          edges: design.computedMST.edges || [],
          cost: design.computedMST.totalCost || 0

        });
      } else {
        setMstResult({ edges: [], cost: 0 }); // Clear MST if not in saved design
      }
      toast(`Loaded design: ${design.name}`, greenToast);
    } catch (err) {
      console.error('Error loading design:', err);
      toast('Failed to load selected design.', redToast);
    }
  }, [setNodes, setEdges, setNodeCounter, setEdgeCounter, setMstResult]);

  return (
    

    <div style={appStyles.container}>
      {showPrompt && (
  <PromptDialog
    message="Enter a name for your design:"
    onSubmit={(value) => {
      setShowPrompt(false);
      handlePromptSubmit(value);
    }}
    onCancel={() => setShowPrompt(false)}
  />
)}
{addNodePromptVisible && (
  <PromptDialog
    message="Enter name for the new node:"
    onSubmit={handleAddNodeNameSubmit}
    onCancel={() => setAddNodePromptVisible(false)}
  />
)}


      <div style={appStyles.header}>
        <h1 style={appStyles.headerTitle}>Pipeline Network Designer</h1>


        <div style={appStyles.userInfo}>
          {isLoggedIn ? (
            <>
              <span>Welcome, {username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
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
    //backgroundColor: '#e0f2f1', // light teal background for freshness
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#1e293b', // deep slate indigo
    color: '#f8fafc', // light white-blue text
  },

  headerTitle: {
    margin: 0,
    fontSize: '1.5em',
    color: '#f8fafc', // match header text color
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