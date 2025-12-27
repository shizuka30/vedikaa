// server/controllers/authController.js
const User = require('../models/User');
const EventManager = require('../models/EventManager');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role, phoneNumber, companyName, location, yearsOfExperience, specialties } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // --- THIS IS THE CORRECTED LOGIC ---
        // This guarantees that if the 'role' from the form is missing (which it is for hosts),
        // it will default to 'host'.
        const user = new User({ 
            name, 
            email, 
            password, 
            role: role || 'host', // The key fix is here
            phoneNumber, 
            isVerified: true 
        });
        const createdUser = await user.save({ session });

        if (role === 'manager') {
            if (!companyName || !location || !yearsOfExperience || !specialties) {
                throw new Error('Missing required manager fields for registration');
            }
            await EventManager.create([{
                userId: createdUser._id, companyName, location, yearsOfExperience, specialties,
                portfolio: [], packages: []
            }], { session });
        }
        
        await session.commitTransaction();
        session.endSession();
        
        // Always send a simple success message and prompt the user to log in.
        res.status(201).json({ message: 'Registration successful! Please log in to continue.' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message || 'Invalid user data' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                message: 'Login successful',
                token: generateToken(user._id, user.role),
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};