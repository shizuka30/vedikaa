// server/models/EventManager.js

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: String,
  eventType: String,
  price: Number,
  description: String,
  servicesIncluded: [String],
  imageUrl: String, // --- ADD THIS LINE ---
});

const portfolioSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  description: String,
  eventDate: Date,
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const eventManagerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    city: String,
    area: String,
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  portfolio: [portfolioSchema],
  specialties: [String], // e.g., ['Weddings', 'Corporate', 'Luxury Events']
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Busy', 'On Request'],
    default: 'Available',
  },
  packages: [packageSchema],
  bookedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('EventManager', eventManagerSchema);