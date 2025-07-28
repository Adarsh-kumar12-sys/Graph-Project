
// const Graph = require('../models/Graph.js');

// const saveGraph = async (req, res) => {
//   try {

//     console.log("BODY:", req.body);
//     console.log("USER:", req.user);

//     const { nodes, edges } = req.body;
//     const userId = req.user.id;

//     const newGraph = new Graph({
//       user: userId,
//       nodes,
//       edges,
//     });

//     await newGraph.save();
//     res.status(201).json({ message: 'Graph saved successfully', graph: newGraph });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error saving graph' });
//   }
// };

// const getUserGraphs = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const graphs = await Graph.find({ user: userId });
//     res.json(graphs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error fetching graphs' });
//   }
// };

// module.exports = {
//   saveGraph,
//   getUserGraphs,
// };


// given by another chatgpt use it if error found

const Graph = require('../models/Graph.js'); 

const saveGraph = async (req, res) => {
  try {
    const { name, nodes, edges, source, target, mode } = req.body; // include all fields
    const userId = req.user.id;

    const newGraph = new Graph({
      user: userId,
      name,
      nodes,
      edges,
      source,
      target,
      mode
    });

    await newGraph.save();
    res.status(201).json({ message: 'Graph saved successfully', graph: newGraph });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving graph' });
  }
};

const getUserGraphs = async (req, res) => {
  try {
    const userId = req.user.id;
    const graphs = await Graph.find({ user: userId });
    res.json(graphs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching graphs' });
  }
};

// Delete a graph by ID
const deleteGraph = async (req, res) => {
  try {
    const userId = req.user.id;
    const graphId = req.params.id;
    const graph = await Graph.findOneAndDelete({ _id: graphId, user: userId });
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }
    res.json({ message: 'Graph deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting graph' });
  }
};

module.exports = {
  saveGraph,
  getUserGraphs,
  deleteGraph,
};
