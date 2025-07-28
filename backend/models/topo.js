const mongoose = require("mongoose");

const topoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  courses: {
    type: [String],
    required: true
  },
  prerequisites: {
    type: [[String]], // Format: [courseA, courseB] => courseA → courseB
    required: true
  },
  result: {
    type: [String], // Topological sort output
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Topo", topoSchema);
