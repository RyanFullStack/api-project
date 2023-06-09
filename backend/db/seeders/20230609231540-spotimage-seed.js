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
        url: '/images/1',
        preview: false
      },
      {
        spotId: 2,
        url: '/images/2',
        preview: false
      },
      {
        spotId: 3,
        url: '/images/3',
        preview: false
      },
      {
        spotId: 4,
        url: '/images/4',
        preview: false
      },
      {
        spotId: 5,
        url: '/images/5',
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
