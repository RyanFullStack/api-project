'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Spot } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    options.validate = true;

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '71 S Main St.',
        city: 'Fallon',
        state: 'Nevada',
        country: 'USA',
        lat: 39.474,
        lng: 118.777,
        name: 'Fallon Theatres',
        description: 'Come stay in this classic historical movie theatre!',
        price: 999.99
      },
      {
        ownerId: 2,
        address: '1 Liberty Island',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.689,
        lng: 74.044,
        name: 'Statue of Liberty',
        description: 'Sleep inside the statue!',
        price: 499.99
      },
      {
        ownerId: 3,
        address: '10 Rainbow Blvd',
        city: 'Niagra Falls',
        state: 'New York',
        country: 'USA',
        lat: 39.474,
        lng: 118.777,
        name: 'Niagra Falls',
        description: 'Guaranteed to be moist!',
        price: 49.99
      },
      {
        ownerId: 4,
        address: 'US HWY 101',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.809,
        lng: 122.497,
        name: 'Golden Gate Bridge',
        description: 'Come sleep right on the bridge!',
        price: 299.99
      },
      {
        ownerId: 5,
        address: '400 Broad St',
        city: 'Seattle',
        state: 'Washington',
        country: 'USA',
        lat: 47.620,
        lng: 122.349,
        name: 'Seattle Space Needle',
        description: 'Sleep right on the tip!',
        price: 99.99
      }
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      ownerId: { [Op.between]: [1,5] }
    }, {});
  }
};
