const { sequelize } = require('../config/database');
const Sequelize = require('sequelize');

// Import models
const Donor = require('./donor');
const Recipient = require('./recipient');
const BloodRequest = require('./bloodRequest');
const Donation = require('./donation');

// Initialize models
const models = {
  Donor: Donor(sequelize, Sequelize),
  Recipient: Recipient(sequelize, Sequelize),
  BloodRequest: BloodRequest(sequelize, Sequelize),
  Donation: Donation(sequelize, Sequelize)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize
};
