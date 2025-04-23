#!/usr/bin/env node

/**
 * Trustable Cares - Blood Donation Platform
 * 
 * This script starts the server and initializes the application.
 * It handles database connection, server startup, and error handling.
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
const http = require('http');

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Start the server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    console.log('Database connection established successfully.');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');
    
    // Start listening
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Normalize a port into a number, string, or false
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  console.log(`Server URL: http://localhost:${port}`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
