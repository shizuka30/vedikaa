// server/controllers/managerController.js
const EventManager = require('../models/EventManager');

// @desc    Fetch all event managers with filtering and keyword search
exports.getManagers = async (req, res) => {
  try {
    const { keyword, eventType, budget } = req.query;
    let filterConditions = [];

    if (keyword) {
      const searchRegex = new RegExp(keyword, 'i');
      filterConditions.push({
        $or: [
          { companyName: searchRegex },
          { 'location.city': searchRegex },
          { 'location.area': searchRegex },
        ],
      });
    }
    if (eventType) {
      filterConditions.push({ 'packages.eventType': eventType });
    }
    if (budget) {
      filterConditions.push({ 'packages.price': { $lte: parseInt(budget) } });
    }

    const query = filterConditions.length > 0 ? { $and: filterConditions } : {};
    const managers = await EventManager.find(query);

    res.status(200).json({ success: true, count: managers.length, data: managers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Fetch a single event manager by ID
exports.getManagerById = async (req, res) => {
  try {
    const manager = await EventManager.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'hostId', select: 'name' }
    });
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }
    res.status(200).json({ success: true, data: manager });
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Manager not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get the profile for the logged-in manager
exports.getMyManagerProfile = async (req, res) => {
  try {
    const managerProfile = await EventManager.findOne({ userId: req.user.id });
    if (!managerProfile) {
      return res.status(404).json({ message: 'Manager profile not found for this user.' });
    }
    res.status(200).json({ success: true, data: managerProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update the profile for the logged-in manager
exports.updateMyManagerProfile = async (req, res) => {
  try {
    const managerProfile = await EventManager.findOne({ userId: req.user.id });
    if (!managerProfile) {
      return res.status(404).json({ message: 'Manager profile not found.' });
    }
    managerProfile.companyName = req.body.companyName || managerProfile.companyName;
    managerProfile.location.city = req.body.location?.city || managerProfile.location.city;
    managerProfile.location.area = req.body.location?.area || managerProfile.location.area;
    managerProfile.yearsOfExperience = req.body.yearsOfExperience || managerProfile.yearsOfExperience;
    managerProfile.specialties = req.body.specialties || managerProfile.specialties;
    const updatedProfile = await managerProfile.save();
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Add a new package to a manager's profile
exports.addPackage = async (req, res) => {
    try {
        const { name, eventType, price, description, servicesIncluded, imageUrl } = req.body;
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) { return res.status(404).json({ message: 'Manager profile not found.' }); }
        const newPackage = { name, eventType, price, description, servicesIncluded, imageUrl };
        managerProfile.packages.push(newPackage);
        await managerProfile.save();
        res.status(201).json({ success: true, data: managerProfile });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Could not add package', error: error.message });
    }
};

// @desc    Update a specific package for the logged-in manager
exports.updatePackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { price, description, servicesIncluded } = req.body;
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) { return res.status(404).json({ message: 'Manager profile not found.' }); }
        const packageToUpdate = managerProfile.packages.id(packageId);
        if (!packageToUpdate) { return res.status(404).json({ message: 'Package not found.' }); }
        packageToUpdate.price = price || packageToUpdate.price;
        packageToUpdate.description = description || packageToUpdate.description;
        packageToUpdate.servicesIncluded = servicesIncluded || packageToUpdate.servicesIncluded;
        const updatedProfile = await managerProfile.save();
        res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a package from a manager's profile
exports.deletePackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) { return res.status(404).json({ message: 'Manager profile not found.' }); }
        const packageToRemove = managerProfile.packages.id(packageId);
        if (!packageToRemove) { return res.status(404).json({ message: 'Package not found.' }); }
        packageToRemove.remove();
        await managerProfile.save();
        res.status(200).json({ success: true, data: managerProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add a new portfolio item for the logged-in manager
exports.addPortfolioItem = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) { return res.status(404).json({ message: 'Manager profile not found.' }); }
        const newPortfolioItem = { title, description, imageUrl };
        managerProfile.portfolio.unshift(newPortfolioItem);
        await managerProfile.save();
        res.status(201).json({ success: true, data: managerProfile });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Could not add portfolio item', error: error.message });
    }
};

// @desc    Delete a portfolio item for the logged-in manager
exports.deletePortfolioItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const managerProfile = await EventManager.findOne({ userId: req.user.id });
        if (!managerProfile) { return res.status(404).json({ message: 'Manager profile not found.' }); }
        const itemToRemove = managerProfile.portfolio.id(itemId);
        if (!itemToRemove) { return res.status(404).json({ message: 'Portfolio item not found.' }); }
        itemToRemove.remove();
        await managerProfile.save();
        res.status(200).json({ success: true, data: managerProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};