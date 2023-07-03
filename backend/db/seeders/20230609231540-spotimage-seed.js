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
        url: 'https://www.fallonchamber.com/wp-content/uploads/2019/10/FallonTheatreLogo.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/09/1200/675/statue-of-liberty-1.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.britannica.com/30/94430-050-D0FC51CD/Niagara-Falls.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.spaceneedle.com/imager/assets/2113/az190903-0590_3a41f671e85a5cdee99cc1724d904ba9.jpg',
        preview: true
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
