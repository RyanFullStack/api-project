'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })
      Booking.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
