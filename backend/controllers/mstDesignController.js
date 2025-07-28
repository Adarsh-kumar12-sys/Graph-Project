const MSTDesign = require('../models/MSTDesign');

// GET all designs for a user
const getAllDesigns = async (req, res) => {
  try {
    const designs = await MSTDesign.find({ userId: req.user.id });
    res.json(designs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
};

// GET one design
const getDesignById = async (req, res) => {
  try {
    const design = await MSTDesign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};

// POST create design
const createDesign = async (req, res) => {
  try {
    const { name, nodes, edges, computedMST } = req.body;
    console.log("REQ.USER:", req.user);
    console.log("BODY:", { name, nodes, edges, computedMST });

    const newDesign = await MSTDesign.create({
      userId: req.user.id,
      name,
      nodes,
      edges,
      computedMST // ✅ Add this to save the MST result
    });

    res.status(201).json(newDesign);
  } catch (err) {
    console.error("CREATE DESIGN ERROR:", err.message);
    res.status(400).json({ error: 'Failed to create design' });
  }
};



// PUT update design
const updateDesign = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const updated = await MSTDesign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, nodes, edges },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update design' });
  }
};

// POST run Prim's MST
const getMST = async (req, res) => {
  try {
    const design = await MSTDesign.findOne({ _id: req.params.id, userId: req.user.id });
    if (!design) return res.status(404).json({ error: 'Design not found' });

    const mstResult = runPrimsAlgorithm(design.nodes, design.edges);
    res.json(mstResult);
  } catch {
    res.status(500).json({ error: 'Failed to compute MST' });
  }
};

// ---- Dummy Prim's Algo (replace with real one)
function runPrimsAlgorithm(nodes, edges) {
  return {
    mstEdges: [],
    totalCost: 0
  };
}

module.exports = {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  getMST
};
