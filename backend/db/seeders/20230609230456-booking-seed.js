'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Booking } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    options.validate = true;

    await Booking.bulkCreate([
      {
        spotId: 5,
        userId: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-08'
      },
      {
        spotId: 4,
        userId: 2,
        startDate: '2024-01-01',
        endDate: '2024-01-08'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2025-07-01',
        endDate: '2025-07-08'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '2024-04-01',
        endDate: '2024-04-08'
      },
      {
        spotId: 2,
        userId: 5,
        startDate: '2023-09-01',
        endDate: '2023-09-08'
      }
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: { [Op.between]: [1,5] }
    }, {});
  }
};
