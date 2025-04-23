/**
 * API Test Script
 * 
 * This script tests the API endpoints to ensure they are working correctly.
 * It makes requests to various endpoints and logs the responses.
 */

require('dotenv').config();
const axios = require('axios');

// Base URL for API requests
const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

// Test endpoints
const endpoints = [
  { method: 'GET', url: '/', name: 'Home Page' },
  { method: 'GET', url: '/api/stats', name: 'Statistics' },
  { method: 'GET', url: '/api/donors', name: 'Donors List' },
  { method: 'GET', url: '/api/recipients', name: 'Recipients List' },
  { method: 'GET', url: '/api/requests', name: 'Blood Requests' }
];

// Function to test an endpoint
async function testEndpoint(endpoint) {
  try {
    console.log(`Testing ${endpoint.name} (${endpoint.method} ${endpoint.url})...`);
    
    const response = await axios({
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.url}`,
      timeout: 5000 // 5 seconds timeout
    });
    
    console.log(`✅ ${endpoint.name}: Success (${response.status})`);
    return true;
  } catch (error) {
    if (error.response) {
      console.error(`❌ ${endpoint.name}: Failed (${error.response.status})`);
    } else if (error.request) {
      console.error(`❌ ${endpoint.name}: No response received. Is the server running?`);
    } else {
      console.error(`❌ ${endpoint.name}: Error - ${error.message}`);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('=== Trustable Cares API Test ===');
  console.log(`Testing API at ${BASE_URL}`);
  console.log('------------------------------');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    console.log('------------------------------');
  }
  
  console.log('=== Test Summary ===');
  console.log(`Total: ${endpoints.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\n⚠️ Some tests failed. Please check the server logs for more information.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! The API is working correctly.');
    process.exit(0);
  }
}

// Check if server is already running
axios.get(`${BASE_URL}/api/stats`)
  .then(() => {
    // Server is running, proceed with tests
    runTests();
  })
  .catch(() => {
    console.error('❌ Server is not running. Please start the server before running tests.');
    console.log('You can start the server with: npm start');
    process.exit(1);
  });
