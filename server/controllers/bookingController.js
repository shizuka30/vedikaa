// server/controllers/bookingController.js
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Booking = require('../models/Booking');
const EventManager = require('../models/EventManager');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Host only)
// In server/controllers/bookingController.js
exports.createBooking = async (req, res) => {
  req.body.hostId = req.user.id;
  try {
    const newBooking = await Booking.create(req.body);

    const manager = await EventManager.findByIdAndUpdate(req.body.managerId, {
      $push: { bookedEvents: newBooking._id },
    });

    // --- NEW EMAIL LOGIC ---
    // Find the manager's login email
    const managerUser = await User.findById(manager.userId);
    if (managerUser) {
        const message = `
            <h1>You have a new booking request!</h1>
            <p><strong>Host Name:</strong> ${req.user.name}</p>
            <p><strong>Event Type:</strong> ${newBooking.eventType}</p>
            <p><strong>Event Date:</strong> ${new Date(newBooking.eventDate).toLocaleDateString()}</p>
            <p>Please log in to your dashboard to accept or decline this request.</p>
        `;
        try {
            await sendEmail({
                email: managerUser.email,
                subject: 'New Booking Request on Vedika',
                html: message,
            });
        } catch (emailError) {
            console.error("Failed to send new booking email:", emailError);
        }
    }
    // --- END NEW EMAIL LOGIC ---

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for the logged-in manager
// @route   GET /api/bookings/my-requests
// @access  Private (Manager only)
exports.getManagerBookings = async (req, res) => {
    try {
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) {
            return res.status(404).json({ message: 'Manager profile not found' });
        }
        // Find bookings where the managerId matches the manager's profile ID
        const bookings = await Booking.find({ managerId: managerProfile._id }).populate('hostId', 'name email');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Add this new function to server/controllers/bookingController.js

// @desc    Update a booking's status
// @route   PUT /api/bookings/:id
// @access  Private (Manager of the booking only)
// In server/controllers/bookingController.js
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('hostId', 'email name');
        if (!booking) { /* ... */ }

        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (booking.managerId.toString() !== managerProfile._id.toString()) { /* ... */ }
        
        booking.status = status;
        await booking.save();
        
        // --- NEW EMAIL LOGIC ---
        if (status === 'Confirmed' || status === 'Cancelled') {
            const hostUser = booking.hostId;
            const message = `
                <h1>Your Booking Status has been updated</h1>
                <p>Hello ${hostUser.name},</p>
                <p>Your booking for the event "${booking.eventType}" has been **${status}** by the manager.</p>
                <p>You can view your bookings in your dashboard.</p>
            `;
            try {
                await sendEmail({
                    email: hostUser.email,
                    subject: `Booking ${status} on Vedika`,
                    html: message,
                });
            } catch (emailError) {
                console.error("Failed to send booking status email:", emailError);
            }
        }
        // --- END NEW EMAIL LOGIC ---

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Add these to server/controllers/bookingController.js

// @desc    Get bookings for the logged-in host
// @route   GET /api/bookings/my-bookings
// @access  Private (Host only)
exports.getHostBookings = async (req, res) => {
    try {
        // Find bookings made by the currently logged-in user (req.user.id)
        const bookings = await Booking.find({ hostId: req.user.id }).populate('managerId', 'companyName');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Cancel a booking (by the host)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Host who made the booking only)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Security check: ensure the user cancelling is the one who made the booking
        if (booking.hostId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        booking.status = 'Cancelled';
        await booking.save();
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};