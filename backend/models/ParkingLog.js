'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ParkingLog extends Model {
    static associate(models) {
      ParkingLog.belongsTo(models.ParkingLocation, { foreignKey: 'parkingCode', targetKey: 'code' });
      ParkingLog.belongsTo(models.User, { foreignKey: 'attendantId' });
    }
  }
  ParkingLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parkingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entryDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      exitDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      chargedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('parked', 'exited'),
        allowNull: false,
        defaultValue: 'parked',
      },
      attendantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ParkingLog',
    }
  );
  return ParkingLog;
};
