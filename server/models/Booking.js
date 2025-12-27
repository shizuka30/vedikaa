// server/models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventManager',
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  guestCount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  packageBooked: {
    name: String,
    price: Number,
  },
  // Add this inside the bookingSchema object
  isReviewed: {
    type: Boolean,
    default: false,
  },
  notes: String // Optional notes from the host
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);