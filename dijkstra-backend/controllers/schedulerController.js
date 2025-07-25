const Topo = require("../models/topo");
const topoSort = require("../utils/topoSort");

const createTopoPlan = async (req, res) => {
  const { name, courses, prerequisites } = req.body;
  const userId = req.user.id;

  if (!name || !courses || !prerequisites) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Perform topological sort
    const sortedOrder = topoSort(courses, prerequisites);

    // Save to database
    const newPlan = new Topo({
      user: userId,
      name,
      courses,
      prerequisites,
      result: sortedOrder
    });

    await newPlan.save();

    res.status(201).json({
      message: "Course schedule created successfully.",
      sortedOrder
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "An error occurred while creating the plan."
    });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    const plans = await Topo.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

const deletePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    const plan = await Topo.findOne({ _id: planId, user: userId });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await Topo.findByIdAndDelete(planId);

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete plan" });
  }
};

module.exports = {
  createTopoPlan,
  getAllPlans,
  deletePlan
};
