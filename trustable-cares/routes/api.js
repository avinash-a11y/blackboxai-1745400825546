const express = require('express');
const router = express.Router();
const { Donor, Recipient, BloodRequest, Donation, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all donors
router.get('/donors', async (req, res) => {
  try {
    const donors = await Donor.findAll({
      attributes: { exclude: ['medicalConditions'] } // Exclude sensitive information
    });
    res.status(200).json({ success: true, donors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get donor by ID
router.get('/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id, {
      attributes: { exclude: ['medicalConditions'] } // Exclude sensitive information
    });
    
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    
    res.status(200).json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all recipients
router.get('/recipients', async (req, res) => {
  try {
    const recipients = await Recipient.findAll({
      attributes: { exclude: ['patientCondition'] } // Exclude sensitive information
    });
    res.status(200).json({ success: true, recipients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recipient by ID
router.get('/recipients/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: { exclude: ['patientCondition'] } // Exclude sensitive information
    });
    
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }
    
    res.status(200).json({ success: true, recipient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all blood requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'bloodGroup', 'city', 'pinCode']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get blood request by ID
router.get('/requests/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'bloodGroup', 'city', 'pinCode', 'hospital']
        }
      ]
    });
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }
    
    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find matching donors for a blood request
router.get('/requests/:id/matches', async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['bloodGroup', 'pinCode']
        }
      ]
    });
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }
    
    // Find compatible blood groups
    const bloodGroup = request.bloodGroup;
    let compatibleGroups = [];
    
    switch(bloodGroup) {
      case 'A+':
        compatibleGroups = ['A+', 'A-', 'O+', 'O-'];
        break;
      case 'A-':
        compatibleGroups = ['A-', 'O-'];
        break;
      case 'B+':
        compatibleGroups = ['B+', 'B-', 'O+', 'O-'];
        break;
      case 'B-':
        compatibleGroups = ['B-', 'O-'];
        break;
      case 'AB+':
        compatibleGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        break;
      case 'AB-':
        compatibleGroups = ['A-', 'B-', 'AB-', 'O-'];
        break;
      case 'O+':
        compatibleGroups = ['O+', 'O-'];
        break;
      case 'O-':
        compatibleGroups = ['O-'];
        break;
    }
    
    // Find matching donors
    const matchingDonors = await Donor.findAll({
      where: {
        bloodGroup: { [Op.in]: compatibleGroups },
        pinCode: request.recipient.pinCode,
        isAvailable: true
      },
      attributes: ['id', 'name', 'bloodGroup', 'phone', 'city', 'lastDonationDate']
    });
    
    res.status(200).json({ 
      success: true, 
      request,
      matchingDonors,
      matchCount: matchingDonors.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a donation
router.post('/donations', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { donorId, requestId, units, hospital, notes } = req.body;
    
    // Check if donor exists
    const donor = await Donor.findByPk(donorId, { transaction: t });
    if (!donor) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    
    // Check if request exists
    const request = await BloodRequest.findByPk(requestId, { transaction: t });
    if (!request) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }
    
    // Create donation
    const donation = await Donation.create({
      donorId,
      requestId,
      units,
      hospital,
      notes,
      status: 'Scheduled'
    }, { transaction: t });
    
    // Update donor's last donation date and availability
    await donor.update({
      lastDonationDate: new Date(),
      isAvailable: false
    }, { transaction: t });
    
    // Update request status if all units are fulfilled
    const donations = await Donation.findAll({
      where: { requestId },
      attributes: [[sequelize.fn('SUM', sequelize.col('units')), 'totalUnits']],
      raw: true,
      transaction: t
    });
    
    const totalDonatedUnits = parseInt(donations[0].totalUnits) || 0;
    
    if (totalDonatedUnits >= request.unitsRequired) {
      await request.update({
        status: 'Fulfilled'
      }, { transaction: t });
    } else if (request.status === 'Pending') {
      await request.update({
        status: 'Matched'
      }, { transaction: t });
    }
    
    await t.commit();
    
    res.status(201).json({ 
      success: true, 
      donation,
      message: 'Donation scheduled successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update donation status
router.put('/donations/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { status } = req.body;
    const donation = await Donation.findByPk(req.params.id, { transaction: t });
    
    if (!donation) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    
    await donation.update({ status }, { transaction: t });
    
    // If donation is completed, update donor's availability after 3 months
    if (status === 'Completed') {
      const donor = await Donor.findByPk(donation.donorId, { transaction: t });
      
      // Set donor to be available after 3 months
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      
      // Schedule donor to be available after 3 months (in a real app, this would be a cron job)
      setTimeout(async () => {
        try {
          await donor.update({ isAvailable: true });
          console.log(`Donor ${donor.id} is now available for donation again`);
        } catch (error) {
          console.error(`Error updating donor availability: ${error.message}`);
        }
      }, threeMonthsLater.getTime() - Date.now());
    } else if (status === 'Cancelled') {
      // If donation is cancelled, make donor available again
      const donor = await Donor.findByPk(donation.donorId, { transaction: t });
      await donor.update({ isAvailable: true }, { transaction: t });
      
      // Update request status if needed
      const request = await BloodRequest.findByPk(donation.requestId, { transaction: t });
      if (request.status === 'Matched') {
        // Check if there are other active donations for this request
        const activeDonations = await Donation.count({
          where: {
            requestId: donation.requestId,
            status: { [Op.ne]: 'Cancelled' },
            id: { [Op.ne]: donation.id }
          },
          transaction: t
        });
        
        if (activeDonations === 0) {
          await request.update({ status: 'Pending' }, { transaction: t });
        }
      }
    }
    
    await t.commit();
    
    res.status(200).json({ 
      success: true, 
      donation,
      message: `Donation ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const donorCount = await Donor.count();
    const recipientCount = await Recipient.count();
    const requestCount = await BloodRequest.count();
    const fulfilledRequestCount = await BloodRequest.count({
      where: { status: 'Fulfilled' }
    });
    const donationCount = await Donation.count({
      where: { status: 'Completed' }
    });
    
    // Blood group distribution
    const bloodGroupDistribution = await Donor.findAll({
      attributes: [
        'bloodGroup',
        [sequelize.fn('COUNT', sequelize.col('bloodGroup')), 'count']
      ],
      group: ['bloodGroup'],
      raw: true
    });
    
    // Recent donations
    const recentDonations = await Donation.findAll({
      where: { status: 'Completed' },
      include: [
        {
          model: Donor,
          as: 'donor',
          attributes: ['name', 'bloodGroup']
        },
        {
          model: BloodRequest,
          as: 'request',
          attributes: ['hospital']
        }
      ],
      order: [['donationDate', 'DESC']],
      limit: 5
    });
    
    res.status(200).json({
      success: true,
      stats: {
        donorCount,
        recipientCount,
        requestCount,
        fulfilledRequestCount,
        donationCount,
        bloodGroupDistribution,
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
