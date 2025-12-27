// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams is important here!
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);

module.exports = router;