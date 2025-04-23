module.exports = (sequelize, DataTypes) => {
  const BloodRequest = sequelize.define('BloodRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Recipients',
        key: 'id'
      }
    },
    bloodGroup: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
      allowNull: false
    },
    unitsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    urgency: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      allowNull: false,
      defaultValue: 'Medium'
    },
    requiredBy: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hospital: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Matched', 'Fulfilled', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  BloodRequest.associate = (models) => {
    BloodRequest.belongsTo(models.Recipient, {
      foreignKey: 'recipientId',
      as: 'recipient'
    });
    
    BloodRequest.hasMany(models.Donation, {
      foreignKey: 'requestId',
      as: 'donations'
    });
  };

  return BloodRequest;
};
