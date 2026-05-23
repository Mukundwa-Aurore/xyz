'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ParkingLocation extends Model {
    static associate(models) {
      ParkingLocation.hasMany(models.ParkingLog, { foreignKey: 'parkingCode', sourceKey: 'code' });
    }
  }
  ParkingLocation.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalSpaces: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      availableSpaces: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hourlyFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ParkingLocation',
    }
  );
  return ParkingLocation;
};
