const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String // 'city', 'plant', 'tank'
});

const edgeSchema = new mongoose.Schema({
  from: String,
  to: String,
  cost: Number
});

// New sub-schema for computed MST
const computedMSTSchema = new mongoose.Schema({
  edges: [edgeSchema],
  totalCost: Number
}, { _id: false });

const mstDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  nodes: [nodeSchema],
  edges: [edgeSchema],
  computedMST: computedMSTSchema, // ✅ Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MSTDesign', mstDesignSchema);
