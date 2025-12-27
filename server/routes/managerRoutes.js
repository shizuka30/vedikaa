// server/routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getManagers, getManagerById, getMyManagerProfile, 
  updateMyManagerProfile, addPackage, updatePackage, deletePackage,
  addPortfolioItem, deletePortfolioItem
} = require('../controllers/managerController');
const { protect } = require('../middleware/authMiddleware');

// Profile routes
router.route('/profile/me').get(protect, getMyManagerProfile).put(protect, updateMyManagerProfile);

// Package routes
router.route('/packages').post(protect, addPackage);
router.route('/packages/:packageId').put(protect, updatePackage).delete(protect, deletePackage);

// Portfolio routes
router.route('/portfolio').post(protect, addPortfolioItem);
router.route('/portfolio/:itemId').delete(protect, deletePortfolioItem);

// Public routes
router.route('/').get(getManagers);
router.route('/:id').get(getManagerById);

module.exports = router;