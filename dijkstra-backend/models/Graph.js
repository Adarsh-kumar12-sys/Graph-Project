// models/Graph.js
// import mongoose from "mongoose";

const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nodes: {
    type: [String],
    required: true
  },
  edges: {
    type: [[mongoose.Schema.Types.Mixed]], // Format: [source, target, weight]
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String // Can be null if mode is "all"
  },
  mode: {
    type: String,
    enum: ["single", "all"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// export default mongoose.model("Graph", graphSchema);
module.exports = mongoose.model("Graph", graphSchema); // Use CommonJS export for compatibility
