'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CarEntry extends Model {
    static associate(models) {
      CarEntry.belongsTo(models.Parking, { foreignKey: 'parkingCode', targetKey: 'code' });
      CarEntry.belongsTo(models.User, { foreignKey: 'attendantId' });
    }
  }
  CarEntry.init(
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
      attendantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CarEntry',
    }
  );
  return CarEntry;
};
