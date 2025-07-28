function topoSort(courses, prerequisites) {
  const adjList = {};
  const inDegree = {};

  // Initialize adjacency list and inDegree map
  for (const course of courses) {
    adjList[course] = [];
    inDegree[course] = 0;
  }

  // Build the graph
  for (const [pre, next] of prerequisites) {
    adjList[pre].push(next);
    inDegree[next]++;
  }

  // Find all nodes with 0 in-degree
  const queue = [];
  for (const course of courses) {
    if (inDegree[course] === 0) {
      queue.push(course);
    }
  }

  const sorted = [];

  while (queue.length > 0) {
    const curr = queue.shift();
    sorted.push(curr);

    for (const neighbor of adjList[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If not all courses are in sorted list, there's a cycle
  if (sorted.length !== courses.length) {
    throw new Error("Cycle detected: no valid course ordering possible.");
  }

  return sorted;
}

module.exports = topoSort;
