// import express from "express";
const express = require('express');
const { signup, login } = require('../controllers/authController.js'); 


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// export default router;
module.exports = router; // Use CommonJS export for compatibility

