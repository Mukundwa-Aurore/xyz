'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    static associate(models) {
      Parking.hasMany(models.CarEntry, { foreignKey: 'parkingCode', sourceKey: 'code' });
    }
  }
  Parking.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      parkingName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfSpaces: {
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
      chargingFeePerHour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Parking',
    }
  );
  return Parking;
};
