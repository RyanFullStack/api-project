'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { ReviewImage } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    options.validate = true;

    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: '/reviews/1.jpg'
      },
      {
        reviewId: 2,
        url: '/reviews/2.jpg'
      },
      {
        reviewId: 3,
        url: '/reviews/3.jpg'
      },
      {
        reviewId: 4,
        url: '/reviews/4.jpg'
      },
      {
        reviewId: 5,
        url: '/reviews/5.jpg'
      },
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      reviewId: { [Op.between]: [1,5] }
    }, {});
  }
};
