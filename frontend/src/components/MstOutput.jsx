import React from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";

const MstOutput = ({ mstResult, originalNodes = [] }) => {
  if (!mstResult) return null;

  const nodeIdToName = {};
  originalNodes.forEach(node => {
    nodeIdToName[node.id] = node.data?.label || node.id;
  });

  const uniqueNodeIds = new Set();
  mstResult.edges.forEach(edge => {
    uniqueNodeIds.add(edge.from);
    uniqueNodeIds.add(edge.to);
  });

  // Position nodes in a circle layout
  const angleStep = (2 * Math.PI) / uniqueNodeIds.size;
  const centerX = 300;
const centerY = 150;  // Shift layout upward
const radius = 150;   // Optional: tighter circle


  const nodeList = Array.from(uniqueNodeIds);
  const nodes = nodeList.map((id, index) => ({
    id,
    data: { label: nodeIdToName[id] || id },
    position: {
      x: centerX + radius * Math.cos(index * angleStep),
      y: centerY + radius * Math.sin(index * angleStep)
    },
    style: {
      background: "#f5f5f5",
      border: "1px solid #888",
      padding: 10,
      borderRadius: 5
    }
  }));

  const edges = mstResult.edges.map((edge, index) => ({
    id: `mst-${index}`,
    source: edge.from,
    target: edge.to,
    label: `${edge.weight ?? edge.cost ?? ''}`,

    animated: true,
    style: {
      stroke: '#6f42c1',
      strokeWidth: 2
    },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#fff', color: '#000', fillOpacity: 0.7 }
  }));

  return (
    <div style={{ height: '100vh', width: '100%', border: '1px solid #ccc' }}>
      <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>
        Minimum Cost Pipeline (Total Cost: {mstResult.cost})
      </h3>
      <div style={{ height: '90%', width: '100%' }}>
        <ReactFlow
  nodes={nodes}
  edges={edges}
  fitView
  fitViewOptions={{ padding: 0.3, minZoom: 0.3 }} // Add this
>

          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MstOutput;
