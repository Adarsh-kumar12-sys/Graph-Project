const express = require('express');
const router = express.Router();

const {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  getMST
} = require('../controllers/mstDesignController');

const authMiddleware = require('../middleware/authMiddleware'); // ✅ Your auth

router.use(authMiddleware); // Apply to all routes

router.get('/', getAllDesigns);
router.get('/:id', getDesignById);
router.post('/', createDesign);
router.put('/:id', updateDesign);
router.post('/:id/mst', getMST);

module.exports = router;
