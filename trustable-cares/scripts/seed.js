/**
 * Database Seed Script
 * 
 * This script populates the database with initial data for testing purposes.
 * It creates sample donors, recipients, blood requests, and donations.
 */

require('dotenv').config();
const { sequelize, Donor, Recipient, BloodRequest, Donation } = require('../models');

// Sample data
const donors = [
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '9876543210',
    bloodGroup: 'A+',
    age: 28,
    weight: 75,
    address: '123 Main Street',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110001',
    lastDonationDate: new Date(2023, 8, 15), // September 15, 2023
    medicalConditions: null,
    isAvailable: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    bloodGroup: 'B+',
    age: 25,
    weight: 62,
    address: '456 Park Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    lastDonationDate: new Date(2023, 7, 10), // August 10, 2023
    medicalConditions: null,
    isAvailable: true
  },
  {
    name: 'Rahul Singh',
    email: 'rahul.singh@example.com',
    phone: '9876543212',
    bloodGroup: 'O+',
    age: 32,
    weight: 80,
    address: '789 Lake Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    lastDonationDate: null,
    medicalConditions: null,
    isAvailable: true
  },
  {
    name: 'Neha Patel',
    email: 'neha.patel@example.com',
    phone: '9876543213',
    bloodGroup: 'AB+',
    age: 27,
    weight: 58,
    address: '101 Hill Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600001',
    lastDonationDate: new Date(2023, 9, 5), // October 5, 2023
    medicalConditions: null,
    isAvailable: false
  },
  {
    name: 'Vikram Reddy',
    email: 'vikram.reddy@example.com',
    phone: '9876543214',
    bloodGroup: 'A-',
    age: 35,
    weight: 85,
    address: '202 River View',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500001',
    lastDonationDate: new Date(2023, 6, 20), // July 20, 2023
    medicalConditions: null,
    isAvailable: true
  }
];

const recipients = [
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@example.com',
    phone: '9876543215',
    bloodGroup: 'B+',
    age: 24,
    gender: 'Female',
    hospital: 'City Hospital',
    address: '303 Oak Street',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110001',
    requiredUnits: 2,
    urgency: 'Medium',
    patientCondition: 'Surgery scheduled'
  },
  {
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    phone: '9876543216',
    bloodGroup: 'O+',
    age: 45,
    gender: 'Male',
    hospital: 'Apollo Hospital',
    address: '404 Pine Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    requiredUnits: 1,
    urgency: 'High',
    patientCondition: 'Accident victim'
  },
  {
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    phone: '9876543217',
    bloodGroup: 'A+',
    age: 30,
    gender: 'Female',
    hospital: 'Manipal Hospital',
    address: '505 Cedar Avenue',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    requiredUnits: 3,
    urgency: 'Critical',
    patientCondition: 'Cancer treatment'
  }
];

const bloodRequests = [
  {
    recipientId: 1,
    bloodGroup: 'B+',
    unitsRequired: 2,
    urgency: 'Medium',
    requiredBy: new Date(2023, 10, 20), // November 20, 2023
    hospital: 'City Hospital',
    purpose: 'Surgery',
    status: 'Pending',
    notes: 'Patient scheduled for surgery next week'
  },
  {
    recipientId: 2,
    bloodGroup: 'O+',
    unitsRequired: 1,
    urgency: 'High',
    requiredBy: new Date(2023, 10, 15), // November 15, 2023
    hospital: 'Apollo Hospital',
    purpose: 'Accident',
    status: 'Matched',
    notes: 'Urgent requirement for accident victim'
  },
  {
    recipientId: 3,
    bloodGroup: 'A+',
    unitsRequired: 3,
    urgency: 'Critical',
    requiredBy: new Date(2023, 10, 10), // November 10, 2023
    hospital: 'Manipal Hospital',
    purpose: 'Cancer Treatment',
    status: 'Fulfilled',
    notes: 'Required for ongoing cancer treatment'
  }
];

const donations = [
  {
    donorId: 1,
    requestId: 3,
    donationDate: new Date(2023, 10, 8), // November 8, 2023
    units: 1,
    hospital: 'Manipal Hospital',
    status: 'Completed',
    notes: 'Donation completed successfully'
  },
  {
    donorId: 3,
    requestId: 2,
    donationDate: new Date(2023, 10, 16), // November 16, 2023
    units: 1,
    hospital: 'Apollo Hospital',
    status: 'Scheduled',
    notes: 'Donation scheduled for tomorrow'
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create donors
    const createdDonors = await Donor.bulkCreate(donors);
    console.log(`Created ${createdDonors.length} donors`);

    // Create recipients
    const createdRecipients = await Recipient.bulkCreate(recipients);
    console.log(`Created ${createdRecipients.length} recipients`);

    // Create blood requests
    const createdRequests = await BloodRequest.bulkCreate(bloodRequests);
    console.log(`Created ${createdRequests.length} blood requests`);

    // Create donations
    const createdDonations = await Donation.bulkCreate(donations);
    console.log(`Created ${createdDonations.length} donations`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
