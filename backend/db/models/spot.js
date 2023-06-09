'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    address: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2,30]
      }
  },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
  },
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
