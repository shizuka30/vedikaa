// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

// --- ONE SINGLE IMPORT FOR ALL CONTROLLER FUNCTIONS ---
const { 
  createBooking, 
  getManagerBookings, 
  updateBookingStatus, 
  getHostBookings, 
  cancelBooking 
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');
const reviewRouter = require('./reviewRoutes');

// Route for hosts to create a booking
router.route('/').post(protect, createBooking);
router.use('/:bookingId/reviews', reviewRouter);
// Route for managers to see their requests
router.route('/my-requests').get(protect, getManagerBookings);

// Route for hosts to see their bookings
router.route('/my-bookings').get(protect, getHostBookings);

// Route for hosts to cancel their booking
router.route('/:id/cancel').put(protect, cancelBooking);

// Route for managers to update booking status
router.route('/:id').put(protect, updateBookingStatus);

module.exports = router;