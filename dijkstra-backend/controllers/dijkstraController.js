// controllers/dijkstraController.js
const dijkstra = require('../utils/dijkstra');

exports.runDijkstra = (req, res) => {
  const { nodes, edges, source, target, mode } = req.body;

  if (!nodes || !edges || !source) {
    return res.status(400).json({ error: "Missing input data" });
  }
  

  try {
    const result = dijkstra(nodes, edges, source, mode, target);
    res.json(result);
  } catch (err) {
    console.error('Error in Dijkstra:', err.message);
    res.status(500).json({ error: 'Something went wrong while running Dijkstra' });
  }
};

