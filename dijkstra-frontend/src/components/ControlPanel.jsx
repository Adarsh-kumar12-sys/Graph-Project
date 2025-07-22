// src/components/ControlPanel.jsx
import React, { useState, useEffect } from 'react';
import MstOutput from './MstOutput';

// Define buttonBase outside or at the very top of the styles object
const buttonBaseStyle = {
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.9em',
  flexGrow: 1,
  minWidth: '80px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    opacity: 0.9,
  },
};

const ControlPanel = ({
  onAddNode,
  onClear,
  onSave,
  onLoad,
  onDesignNetwork,
  mstResult,
  nodes,
  onAddEdge,
}) => {
  const [selectedSourceNode, setSelectedSourceNode] = useState('');
  const [selectedTargetNode, setSelectedTargetNode] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');

  useEffect(() => {
    if (nodes.length === 0) {
      setSelectedSourceNode('');
      setSelectedTargetNode('');
      setEdgeWeight('');
    } else {
      if (selectedSourceNode && !nodes.some((node) => node.id === selectedSourceNode)) {
        setSelectedSourceNode('');
      }
      if (selectedTargetNode && !nodes.some((node) => node.id === selectedTargetNode)) {
        setSelectedTargetNode('');
      }
    }
  }, [nodes, selectedSourceNode, selectedTargetNode]);

  const handleAddEdgeClick = () => {
    if (!selectedSourceNode || !selectedTargetNode || edgeWeight === '') {
      alert('Please select source and target nodes and enter a weight.');
      return;
    }
    if (selectedSourceNode === selectedTargetNode) {
      alert('Source and target nodes cannot be the same for an edge.');
      return;
    }

    const weight = parseFloat(edgeWeight);
    if (isNaN(weight)) {
      alert('Please enter a valid number for edge weight.');
      return;
    }

    onAddEdge(selectedSourceNode, selectedTargetNode, weight);
    setSelectedSourceNode('');
    setSelectedTargetNode('');
    setEdgeWeight('');
  };

  return (
    <div style={styles.panelContainer}>
      <div style={styles.controlsSection}>
        <h2 style={styles.sectionTitle}>Controls</h2>

        <div style={styles.buttonGroup}>
          <button style={styles.addNodeButton} onClick={onAddNode}>➕ Add Node</button>
          <button style={styles.clearButton} onClick={onClear}>♻️ Clear</button>
        </div>

        <div style={styles.addEdgeControls}>
          <h4 style={styles.addEdgeTitle}>Add Edge Manually</h4>

          <div style={styles.inlineInputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Source:</label>
              <select
                style={styles.selectInput}
                value={selectedSourceNode}
                onChange={(e) => setSelectedSourceNode(e.target.value)}
                disabled={nodes.length === 0}
              >
                <option value="">Select Source</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.data.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target:</label>
              <select
                style={styles.selectInput}
                value={selectedTargetNode}
                onChange={(e) => setSelectedTargetNode(e.target.value)}
                disabled={nodes.length === 0}
              >
                <option value="">Select Target</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.data.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Weight:</label>
              <input
                type="number"
                style={styles.textInput}
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                placeholder="Weight"
                min="0"
              />
            </div>
          </div>

          <button style={styles.addEdgeFormButton} onClick={handleAddEdgeClick}>
            🔗 Add Edge
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.saveButtonSmall} onClick={onSave}>💾 Save</button>
          <button style={styles.loadButtonSmall} onClick={onLoad}>📂 Load Saved</button>
        </div>

        <div style={styles.runAlgorithmSection}>
          <button style={styles.runPrimButton} onClick={onDesignNetwork}>
            🧮 Run Prim's Algorithm
          </button>
        </div>
      </div>

      <div style={styles.outputSection}>
        <h3 style={styles.sectionTitle}>MST Output</h3>
        <MstOutput nodes={nodes} mstResult={mstResult} />
      </div>
    </div>
  );
};

const styles = {
  panelContainer: {
    width: '380px',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    margin: '20px',
  },
  sectionTitle: {
    fontSize: '1.2em',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  controlsSection: {
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  addNodeButton: {
    ...buttonBaseStyle,
    background: '#007bff',
    flexBasis: 'calc(50% - 5px)',
  },
  clearButton: {
    ...buttonBaseStyle,
    background: '#dc3545',
    flexBasis: 'calc(50% - 5px)',
  },
  saveButtonSmall: {
    ...buttonBaseStyle,
    background: '#28a745',
    padding: '8px 12px',
    fontSize: '0.8em',
    flexBasis: 'calc(50% - 5px)',
  },
  loadButtonSmall: {
    ...buttonBaseStyle,
    background: '#ffc107',
    color: '#333',
    padding: '8px 12px',
    fontSize: '0.8em',
    flexBasis: 'calc(50% - 5px)',
  },
  addEdgeControls: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  addEdgeTitle: {
    fontSize: '1em',
    fontWeight: '600',
    color: '#555',
    marginBottom: '5px',
  },
  inlineInputRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    marginBottom: '5px',
    alignItems: 'flex-end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    flex: 1,
  },
  label: {
    fontSize: '0.75em',
    color: '#555',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  selectInput: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '0.85em',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  textInput: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '0.85em',
    boxSizing: 'border-box',
  },
  addEdgeFormButton: {
    ...buttonBaseStyle,
    background: '#17a2b8',
    width: '100%',
    marginTop: '10px',
  },
  runAlgorithmSection: {
    marginBottom: '20px',
    marginTop: '10px',
  },
  runPrimButton: {
    ...buttonBaseStyle,
    background: '#6f42c1',
    width: '100%',
    padding: '12px 15px',
    fontSize: '1em',
  },
  outputSection: {
    flexGrow: 1,
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default ControlPanel;
