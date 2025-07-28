// utils/dijkstra.js

function dijkstra(nodes, edges, source, mode = 'all', target = null) {
  const graph = {};

  // Initialize graph
  for (let node of nodes) {
    graph[node] = [];
  }

  for (let [from, to, weight] of edges) {
    graph[from].push({ node: to, weight: Number(weight) });
    graph[to].push({ node: from, weight: Number(weight) }); // For undirected graph
  }

  const distances = {};
  const visited = {};
  const previous = {};

  for (let node of nodes) {
    distances[node] = Infinity;
    visited[node] = false;
    previous[node] = null;
  }

  distances[source] = 0;

  while (true) {
    // Find the closest unvisited node
    let closestNode = null;
    for (let node of nodes) {
      if (!visited[node] && (closestNode === null || distances[node] < distances[closestNode])) {
        closestNode = node;
      }
    }

    if (closestNode === null || distances[closestNode] === Infinity) {
      break;
    }

    visited[closestNode] = true;

    for (let neighbor of graph[closestNode]) {
      const newDist = distances[closestNode] + neighbor.weight;
      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        previous[neighbor.node] = closestNode;
      }
    }

    if (mode === 'single' && closestNode === target) {
      break;
    }
  }

  // Helper to build path
  const buildPath = (end) => {
    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    return path;
  };

  if (mode === 'single' && target) {
    const path = buildPath(target);
    return {
      distances: {
        [target]: {
          cost: distances[target],
          path: path.length > 1 ? path : [],
        },
      },
    };
  }

  const result = {};
  for (let node of nodes) {
    if (node === source) continue;
    const path = buildPath(node);
    result[node] = {
      cost: distances[node],
      path: path.length > 1 ? path : [],
    };
  }

  return { distances: result };
}

module.exports = dijkstra;




