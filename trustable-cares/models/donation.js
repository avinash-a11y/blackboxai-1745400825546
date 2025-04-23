module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Donors',
        key: 'id'
      }
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BloodRequests',
        key: 'id'
      }
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    hospital: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Scheduled'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Donation.associate = (models) => {
    Donation.belongsTo(models.Donor, {
      foreignKey: 'donorId',
      as: 'donor'
    });
    
    Donation.belongsTo(models.BloodRequest, {
      foreignKey: 'requestId',
      as: 'request'
    });
  };

  return Donation;
};
