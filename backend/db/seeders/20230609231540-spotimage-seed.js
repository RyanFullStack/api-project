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
        spotId: 1,
        url: 'https://www.churchillarts.org/_imgs/oatsparkartcenter/BarkleyTheatre.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://live.staticflickr.com/5590/15069196400_8b40a5c1a3_b.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://static.thefallonpost.org/data/articles/s4_movies_more_--_upcoming_events_at_the_historic_fallon_1631502054_3796.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/jgnZ91-JIZ8qqgskrdOWhw/348s.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/09/1200/675/statue-of-liberty-1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.nationalreview.com/wp-content/uploads/2022/05/statueofliberty.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.britannica.com/82/183382-050-D832EC3A/Detail-head-crown-Statue-of-Liberty-New.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://media.cnn.com/api/v1/images/stellar/prod/141104114830-nyc-statue-of-liberty.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://www.nps.gov/stli/planyourvisit/images/Liberty-statue-with-manhattan_1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.britannica.com/30/94430-050-D0FC51CD/Niagara-Falls.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.niagarafallsstatepark.com/~/media/parks/niagara-falls/homepage/spotlights/niagarafalls-home-spotlight-maid-of-the-mist-2021.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.niagarafallsstatepark.com/~/media/parks/niagara-falls/homepage/niagara-falls-desktop.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/img-1345-1674218566.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/3Falls_Niagara.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.britannica.com/95/94195-050-FCBF777E/Golden-Gate-Bridge-San-Francisco.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://media.california.com/media/_versions_jpg/articles/golden_gate_bridge__5472x3648____v1222x580__.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F191009121203-golden-gate-bridge-fog.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://images.squarespace-cdn.com/content/v1/5a5986b2cf81e095e172ce87/23b686e2-7043-4bc4-887a-c6c514cfd3b7/flyingdawnmarie-golden-gate-bridge-overlook-13.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.spaceneedle.com/imager/assets/2113/az190903-0590_3a41f671e85a5cdee99cc1724d904ba9.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://insightpestnorthwest.com/wp-content/uploads/2021/04/andrea-leopardi-QfhbK2pY0Ao-unsplash-1-1024x683.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.spaceneedle.com/imager/assets/2125/az190903-0590_mob_4ee4e75fbc3d61709c6a11298686742d.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://veovo.com/wp-content/uploads/2021/11/2Space-needle-crowd-management-veovo.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.spaceneedle.com/assets/_1200x630_crop_center-center_82_none/LoungeHeader1800x800.jpg?mtime=1623445731',
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
