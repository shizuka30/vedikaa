// server/controllers/adminController.js
const User = require('../models/User');
const EventManager = require('../models/EventManager');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'host' });
    res.json(users);
};

exports.getAllManagers = async (req, res) => {
    const managers = await EventManager.find({}).populate('userId', 'name email');
    res.json(managers);
};

exports.getAllBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('hostId', 'name').populate('managerId', 'companyName');
    res.json(bookings);
};

// --- NEW FUNCTIONS ---

exports.toggleManagerVerification = async (req, res) => {
    try {
        const manager = await EventManager.findById(req.params.managerId);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        manager.isVerified = !manager.isVerified;
        await manager.save();
        res.json(manager);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getPlatformStats = async (req, res) => {
    try {
        const completedBookings = await Booking.find({ status: 'Completed' });
        
        const totalRevenue = completedBookings.reduce((acc, booking) => {
            if (booking.packageBooked && booking.packageBooked.price) {
                return acc + booking.packageBooked.price;
            }
            return acc;
        }, 0);
        
        const platformCommission = totalRevenue * 0.20; // 20% commission

        res.json({
            totalBookingsValue: totalRevenue,
            platformCommission,
            completedBookingsCount: completedBookings.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};