const express = require('express');
const router = express.Router();
const path = require('path');
const { Recipient, BloodRequest, Donor } = require('../models');
const { Op } = require('sequelize');

// Recipient registration page
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/recipient-register.html'));
});

// Recipient login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/recipient-login.html'));
});

// Recipient dashboard page
router.get('/dashboard', (req, res) => {
  // Check if recipient is logged in
  if (!req.session.recipientId) {
    return res.redirect('/recipients/login');
  }
  res.sendFile(path.join(__dirname, '../public/recipient-dashboard.html'));
});

// Recipient profile page
router.get('/profile', (req, res) => {
  // Check if recipient is logged in
  if (!req.session.recipientId) {
    return res.redirect('/recipients/login');
  }
  res.sendFile(path.join(__dirname, '../public/recipient-profile.html'));
});

// Recipient request page
router.get('/request', (req, res) => {
  // Check if recipient is logged in
  if (!req.session.recipientId) {
    return res.redirect('/recipients/login');
  }
  res.sendFile(path.join(__dirname, '../public/recipient-request.html'));
});

// Register a new recipient
router.post('/register', async (req, res) => {
  try {
    const recipient = await Recipient.create(req.body);
    req.session.recipientId = recipient.id;
    res.status(201).json({ success: true, recipient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login recipient
router.post('/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const recipient = await Recipient.findOne({ where: { email, phone } });
    
    if (!recipient) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    req.session.recipientId = recipient.id;
    res.status(200).json({ success: true, recipient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Logout recipient
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Create a new blood request
router.post('/request', async (req, res) => {
  try {
    // Check if recipient is logged in
    if (!req.session.recipientId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const recipient = await Recipient.findByPk(req.session.recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }
    
    // Create blood request
    const requestData = {
      ...req.body,
      recipientId: recipient.id,
      bloodGroup: recipient.bloodGroup
    };
    
    const bloodRequest = await BloodRequest.create(requestData);
    
    // Find matching donors based on blood group and pin code
    const matchingDonors = await Donor.findAll({
      where: {
        bloodGroup: recipient.bloodGroup,
        pinCode: recipient.pinCode,
        isAvailable: true
      }
    });
    
    res.status(201).json({ 
      success: true, 
      bloodRequest,
      matchingDonors,
      matchCount: matchingDonors.length
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get recipient's blood requests
router.get('/requests', async (req, res) => {
  try {
    // Check if recipient is logged in
    if (!req.session.recipientId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const requests = await BloodRequest.findAll({
      where: { recipientId: req.session.recipientId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update recipient profile
router.put('/profile', async (req, res) => {
  try {
    // Check if recipient is logged in
    if (!req.session.recipientId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const recipient = await Recipient.findByPk(req.session.recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }
    
    await recipient.update(req.body);
    res.status(200).json({ success: true, recipient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
