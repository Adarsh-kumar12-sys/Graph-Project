const express = require("express");
const router = express.Router();
const { calculateMST } = require("../controllers/mstController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/calculate", authMiddleware, calculateMST);

module.exports = router;
