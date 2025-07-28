// routes/dijkstraRoutes.js
const express = require('express');
const router = express.Router();

const { runDijkstra } = require('../controllers/dijkstraController');

// POST route for Dijkstra
router.post('/dijkstra', runDijkstra);

module.exports = router;
