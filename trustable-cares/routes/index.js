const express = require('express');
const router = express.Router();
const path = require('path');

// Home page route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// About page route
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Contact page route
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// FAQ page route
router.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/faq.html'));
});

module.exports = router;
