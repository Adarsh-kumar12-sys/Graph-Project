// import express from "express";
// import { saveGraph, getUserGraphs } from "../controllers/graphController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const express = require('express');
const { saveGraph, getUserGraphs, deleteGraph } = require('../controllers/graphController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // Use CommonJS import for compatibility


const router = express.Router();

router.post("/save", authMiddleware, saveGraph);
router.get("/my-graphs", authMiddleware, getUserGraphs);
router.delete("/delete/:id", authMiddleware, deleteGraph);

// export default router;
module.exports = router; // Use CommonJS export for compatibility
