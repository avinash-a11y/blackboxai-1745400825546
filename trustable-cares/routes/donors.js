const express = require('express');
const router = express.Router();
const path = require('path');
const { Donor } = require('../models');

// Donor registration page
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/donor-register.html'));
});

// Donor login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/donor-login.html'));
});

// Donor dashboard page
router.get('/dashboard', (req, res) => {
  // Check if donor is logged in
  if (!req.session.donorId) {
    return res.redirect('/donors/login');
  }
  res.sendFile(path.join(__dirname, '../public/donor-dashboard.html'));
});

// Donor profile page
router.get('/profile', (req, res) => {
  // Check if donor is logged in
  if (!req.session.donorId) {
    return res.redirect('/donors/login');
  }
  res.sendFile(path.join(__dirname, '../public/donor-profile.html'));
});

// Donor history page
router.get('/history', (req, res) => {
  // Check if donor is logged in
  if (!req.session.donorId) {
    return res.redirect('/donors/login');
  }
  res.sendFile(path.join(__dirname, '../public/donor-history.html'));
});

// Register a new donor
router.post('/register', async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    req.session.donorId = donor.id;
    res.status(201).json({ success: true, donor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login donor
router.post('/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const donor = await Donor.findOne({ where: { email, phone } });
    
    if (!donor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    req.session.donorId = donor.id;
    res.status(200).json({ success: true, donor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Logout donor
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Update donor profile
router.put('/profile', async (req, res) => {
  try {
    // Check if donor is logged in
    if (!req.session.donorId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const donor = await Donor.findByPk(req.session.donorId);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    
    await donor.update(req.body);
    res.status(200).json({ success: true, donor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
