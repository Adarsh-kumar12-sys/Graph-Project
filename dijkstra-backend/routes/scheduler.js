const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js"); // use your existing auth middleware
// const { createTopoPlan } = require("../controllers/schedulerController");
// const { getAllPlans } = require("../controllers/schedulerController");

// const { deletePlan } = require("../controllers/schedulerController");

const { createTopoPlan, getAllPlans, deletePlan } = require("../controllers/schedulerController");

router.post("/create", authMiddleware, createTopoPlan);
router.get("/all", authMiddleware, getAllPlans);
router.delete("/delete/:id", authMiddleware, deletePlan);

module.exports = router;
