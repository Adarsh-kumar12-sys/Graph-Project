// import express from "express";
const express = require('express');
const { signup, login } = require('../controllers/authController.js'); // 👈 Import your controller functions
// import { signup, login } from "../controllers/authController.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// export default router;
module.exports = router; // 👈 Use CommonJS export for compatibility

