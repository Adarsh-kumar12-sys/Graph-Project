const calculateMST = (req, res) => {
  const { nodes, edges } = req.body;

  if (!nodes || !edges) {
    return res.status(400).json({ message: "Nodes and edges are required" });
  }

  const n = nodes.length;
  const adjList = Array.from({ length: n }, () => []);

  // Map node names to indices
  const nodeIndexMap = {};
  nodes.forEach((node, index) => {
    nodeIndexMap[node] = index;
  });

  // Build adjacency list
  for (const edge of edges) {
    const { from, to, weight } = edge;
    const u = nodeIndexMap[from];
    const v = nodeIndexMap[to];
    adjList[u].push({ node: v, weight });
    adjList[v].push({ node: u, weight });
  }

  const visited = Array(n).fill(false);
  const mstEdges = [];
  const minHeap = [];

  minHeap.push({ from: -1, to: 0, weight: 0 });

  while (minHeap.length && mstEdges.length < n - 1) {
    minHeap.sort((a, b) => a.weight - b.weight);
    const { from, to, weight } = minHeap.shift();

    if (visited[to]) continue;

    visited[to] = true;
    if (from !== -1) {
      mstEdges.push({ from: nodes[from], to: nodes[to], weight });
    }

    for (const neighbor of adjList[to]) {
      if (!visited[neighbor.node]) {
        minHeap.push({ from: to, to: neighbor.node, weight: neighbor.weight });
      }
    }
  }

  const totalCost = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);

  return res.status(200).json({ mst: mstEdges, cost: totalCost });
};

module.exports = { calculateMST };
