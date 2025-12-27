// server/controllers/reviewController.js
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const EventManager = require('../models/EventManager');
const sendEmail = require('../utils/sendEmail'); // Import the email utility
const User = require('../models/User'); // Import the User model to find the manager's email

// @desc    Create a new review for a booking
// @route   POST /api/bookings/:bookingId/reviews
// @access  Private (Host only)
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const bookingId = req.params.bookingId;

        const booking = await Booking.findById(bookingId);

        // --- Validation Checks ---
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        if (booking.hostId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to review this booking.' });
        }
        if (booking.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only review completed bookings.' });
        }
        if (booking.isReviewed) {
            return res.status(400).json({ message: 'Booking has already been reviewed.' });
        }

        // --- Create the Review ---
        const review = await Review.create({
            hostId: req.user.id,
            managerId: booking.managerId,
            bookingId: bookingId,
            rating: Number(rating),
            comment,
        });

        // --- Update Booking and Manager Profile ---
        booking.isReviewed = true;
        await booking.save();

        const manager = await EventManager.findById(booking.managerId);
        const reviews = await Review.find({ managerId: booking.managerId });

        manager.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        manager.reviews.push(review._id);
        await manager.save();

        // --- NEW EMAIL NOTIFICATION LOGIC ---
        // Find the manager's login account to get their email address
        const managerUser = await User.findById(manager.userId);
        if (managerUser) {
            const message = `
                <h1>You have received a new review on Vedika!</h1>
                <p>A client has left new feedback for a completed event.</p>
                <br>
                <p><strong>Host Name:</strong> ${req.user.name}</p>
                <p><strong>Rating:</strong> ${review.rating} / 5 Stars</p>
                <p><strong>Comment:</strong> "${review.comment}"</p>
                <br>
                <p>You can view all your reviews on your public profile. Keep up the great work!</p>
            `;
            try {
                await sendEmail({
                    email: managerUser.email,
                    subject: 'You have a new review on Vedika!',
                    html: message,
                });
            } catch (emailError) {
                // If the email fails, we don't want to crash the whole request.
                // We just log the error on the server for debugging.
                console.error("Failed to send new review email:", emailError);
            }
        }
        // --- END OF NEW EMAIL LOGIC ---

        res.status(201).json({ success: true, message: 'Review submitted successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};