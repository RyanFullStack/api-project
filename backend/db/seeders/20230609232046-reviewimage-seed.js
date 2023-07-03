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
        url: 'https://worldstrides.com/wp-content/uploads/2015/07/Day-2_Golden_Statue-min.jpg'
      },
      {
        reviewId: 2,
        url: 'https://basictravelcouple.com/wp-content/uploads/2022/03/Niagara-Falls-Basic-Travel-Couple-scaled.jpg'
      },
      {
        reviewId: 3,
        url: 'https://thefallontheatre.wildapricot.org/resources/Slideshow/2theatre.jpg'
      },
      {
        reviewId: 4,
        url: 'https://media.tacdn.com/media/attractions-content--1x-1/0f/ef/86/68.jpg'
      },
      {
        reviewId: 5,
        url: 'https://feastio.com/wp-content/uploads/2022/03/Kel-at-Loupe-Lounge.jpg'
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
