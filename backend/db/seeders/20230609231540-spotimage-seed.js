'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { SpotImage } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    options.validate = true;

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: '/spots/1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: '/spots/2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: '/spots/3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: '/spots/4/jpg',
        preview: false
      },
      {
        spotId: 5,
        url: '/spots/5/jpg',
        preview: false
      }
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.between]: [1,5] }
    }, {});
  }
};
