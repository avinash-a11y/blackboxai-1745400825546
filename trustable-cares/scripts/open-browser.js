/**
 * Open Browser Script
 * 
 * This script opens the default browser to the application URL.
 * It's useful for quickly viewing the application after starting the server.
 */

const { exec } = require('child_process');
const os = require('os');

// Get port from environment or use default
const port = process.env.PORT || 8000;
const url = `http://localhost:${port}`;

// Function to open URL in the default browser based on the operating system
function openBrowser(url) {
  console.log(`Opening ${url} in your default browser...`);
  
  const platform = os.platform();
  let command;
  
  switch (platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${url}"`;
      break;
    default: // Linux and others
      command = `xdg-open "${url}"`;
      break;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`Failed to open browser: ${error.message}`);
      console.log(`Please manually open ${url} in your browser.`);
    }
  });
}

// Check if the server is running before opening the browser
const http = require('http');

function checkServerAndOpenBrowser() {
  http.get(url, (res) => {
    if (res.statusCode === 200) {
      openBrowser(url);
    } else {
      console.log(`Server responded with status code ${res.statusCode}`);
      console.log(`Please check if the server is running correctly.`);
    }
  }).on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('Server is not running. Starting server...');
      
      // Try to start the server
      const server = exec('npm start');
      
      server.stdout.on('data', (data) => {
        console.log(data);
        
        // Check for server start message
        if (data.includes('Server running') || data.includes('listening')) {
          setTimeout(() => openBrowser(url), 2000); // Wait 2 seconds before opening browser
        }
      });
      
      server.stderr.on('data', (data) => {
        console.error(data);
      });
    } else {
      console.error(`Error connecting to server: ${err.message}`);
    }
  });
}

// Run the check and open browser
checkServerAndOpenBrowser();
