// server/utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const User = require('../models/User');
const EventManager = require('../models/EventManager');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const allEventPackages = [
    { name: 'Full Wedding Package (5-Day)', eventType: 'Full Wedding Package', price: 500000, imageUrl: 'https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?q=80&w=2070&auto=format&fit=crop', description: 'Complete 5-day wedding planning.', servicesIncluded: ['Full Planning', 'Decor'] },
    { name: 'Modular Wedding Service', eventType: 'Modular Wedding', price: 300000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878355/265057-scarlet-hall-exclusive-manor-house-wedding-venue-cheshire_2x_abgdhw.jpg', description: 'Expert planning for a single event.', servicesIncluded: ['Decor', 'Entertainment'] },
    { name: 'Elegant Engagement Ceremony', eventType: 'Engagement Ceremony', price: 120000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878355/265057-scarlet-hall-exclusive-manor-house-wedding-venue-cheshire_2x_abgdhw.jpg', description: 'A beautiful and memorable engagement.', servicesIncluded: ['Venue Decor', 'Catering'] },
    { name: 'Ultimate Bachelor/Bachelorette Party', eventType: 'Bachelor Party', price: 100000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878706/6550_hm92jz.jpg', description: 'An unforgettable night of fun.', servicesIncluded: ['Venue Booking', 'Activities'] },
    { name: 'Grand Birthday Celebration', eventType: 'Birthday Party', price: 80000, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop', description: 'Themed celebrations for all ages.', servicesIncluded: ['Theme Decor', 'Cake'] },
    { name: 'Anniversary Jubilee (Silver/Golden)', eventType: 'Anniversary', price: 150000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878801/hq720_wmyjuj.jpg', description: 'Celebrate your milestones with elegance.', servicesIncluded: ['Venue', 'Guest Management'] },
    { name: 'Live Music Concert', eventType: 'Music Concert', price: 500000, imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop', description: 'Full-scale concert management.', servicesIncluded: ['Artist Management', 'Security'] },
    { name: 'Corporate Conference', eventType: 'Corporate Event', price: 400000, imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop', description: 'Professional planning for business events.', servicesIncluded: ['AV Setup', 'Logistics'] },
    { name: 'College Fest & Annual Day', eventType: 'Educational Function', price: 250000, imageUrl: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop', description: 'Dynamic events for schools and colleges.', servicesIncluded: ['Stage Setup', 'Permissions'] },
    { name: 'Solemn Memorial Service', eventType: 'Memorial Service', price: 60000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878949/038e8189dab881b5e1c51fa2646853639d64010e-4752x3168_wv28cl.jpg', description: 'Respectful and dignified arrangements.', servicesIncluded: ['Venue Setup', 'Coordination'] },
    { name: 'Divine Devotional Event', eventType: 'Devotional Event', price: 70000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878888/beautiful-decorative-toran-doorway-hanging-background-diwali-indian-background-concept_1279562-7451_aafs6v.jpg', description: 'Organizing serene religious gatherings.', servicesIncluded: ['Setup', 'Seating'] },
    { name: 'Charming Baby Shower', eventType: 'Baby Shower', price: 90000, imageUrl: 'https://res.cloudinary.com/duujnv0es/image/upload/v1753878994/Woodland_Baby_Shower_Decorations_-_Woodland_Balloon_Arch_Kit_1367x_p4h0fy.jpg', description: 'A heartwarming celebration for parents-to-be.', servicesIncluded: ['Theme Decor', 'Games'] },
];

const managersData = [];

const connectDB = async () => {
  try {
    const options = { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 };
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(`DB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    console.log('Destroying old data...');
    await User.deleteMany({});
    await EventManager.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Old data destroyed.');

    console.log('Creating new manager users and profiles...');
    for (const managerData of managersData) {
      const newUser = new User({
        name: managerData.companyName,
        email: managerData.email,
        password: managerData.password,
        role: 'manager',
      });
      const createdUser = await newUser.save();
      
      // --- INTELLIGENT PACKAGE FILTERING LOGIC ---
      const managerSpecificPackages = allEventPackages.filter(pkg => 
        (managerData.specialties || []).includes(pkg.eventType)
      );

      const newManagerProfile = new EventManager({
        userId: createdUser._id,
        companyName: managerData.companyName,
        location: managerData.location,
        specialties: managerData.specialties,
        yearsOfExperience: managerData.yearsOfExperience,
        portfolio: managerData.portfolio,
        // Assign the custom, filtered list of packages
        packages: managerSpecificPackages.length > 0 ? managerSpecificPackages : [], // Assign custom menu, or empty if no match
      });
      await newManagerProfile.save();
      console.log(`- ${managerData.companyName} created with ${managerSpecificPackages.length} packages.`);
    }

    console.log('Data Imported Successfully!');
    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const destroyData = async () => {
    await connectDB();
    try {
        await EventManager.deleteMany();
        await User.deleteMany();
        await Booking.deleteMany();
        await Review.deleteMany();
        console.log('Data Destroyed Successfully!');
        await mongoose.connection.close();
    } catch (error) {
        console.error(`Error during data destruction: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}