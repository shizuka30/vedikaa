// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    getAllManagers, 
    getAllBookings,
    toggleManagerVerification,
    getPlatformStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware'); // Make sure this import exists

// All routes are protected and require the admin role
router.route('/users').get(protect, admin, getAllUsers);
router.route('/managers').get(protect, admin, getAllManagers);
router.route('/bookings').get(protect, admin, getAllBookings);
router.route('/stats').get(protect, admin, getPlatformStats);
router.route('/managers/:managerId/toggle-verify').put(protect, admin, toggleManagerVerification);

module.exports = router;