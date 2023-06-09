'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Review } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    options.validate = true;

    await Review.bulkCreate([
      {
        spotId: 2,
        userId: 1,
        review: 'So hot inside the statue!',
        stars: 2
      },
      {
        spotId: 3,
        userId: 1,
        review: 'I got soaked!',
        stars: 2
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Fallon Theatres is killer!',
        stars: 5
      },
      {
        spotId: 4,
        userId: 2,
        review: 'A bit noisy but was a beautiful view!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 3,
        review: 'If I had a fear of heights this wouldve been terrible!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Lots of stairs but cant beat the view!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 4,
        review: 'Bring a poncho and youre good to go!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 4,
        review: 'Best rooms in Seattle!',
        stars: 5
      },
      {
        spotId: 4,
        userId: 5,
        review: 'I didnt realize we would literally sleep on the bridge!',
        stars: 1
      },
      {
        spotId: 1,
        userId: 5,
        review: 'Fallon Theatres is so cozy and fun!',
        stars: 5
      },
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: { [Op.between]: [1,5] }
    }, {});
  }
};
