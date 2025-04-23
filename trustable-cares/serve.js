/**
 * Trustable Cares - Blood Donation Platform
 * 
 * Simple HTTP server to serve the application without Express.
 * This is useful for testing the frontend without running the full backend.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Port to listen on
const PORT = process.env.PORT || 8000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parse URL to get the pathname
  let pathname = req.url;
  
  // If URL ends with a slash, serve index.html
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }
  
  // Remove query parameters
  pathname = pathname.split('?')[0];
  
  // Map URL to file path
  let filePath = path.join(__dirname, 'public', pathname);
  
  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // If file doesn't exist, serve 404 page
      console.error(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>');
      return;
    }
    
    // If it's a directory, try to serve index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    // Read file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${filePath}`, err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>An error occurred while processing your request.</p>');
        return;
      }
      
      // Get file extension
      const ext = path.extname(filePath);
      
      // Set Content-Type header
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      
      // Send file content
      res.end(data);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
=================================================
  Trustable Cares - Blood Donation Platform
=================================================

  Server running at http://localhost:${PORT}
  
  This is a simple HTTP server that serves the
  static files from the 'public' directory.
  
  Press Ctrl+C to stop the server.
=================================================
`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  }
  
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});
