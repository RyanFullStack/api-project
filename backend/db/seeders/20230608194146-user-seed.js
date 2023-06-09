'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { User } = require('../models')
//IMPORT MODEL AND CHANGE TO BULK CREATE
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    options.validate = true;

    await User.bulkCreate([
      {
        email: 'reede@gmail.com',
        firstName: 'Erik',
        lastName: 'Reed',
        username: 'ReedE',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'daveg@gmail.com',
        firstName: 'Dave',
        lastName: 'Guendner',
        username: 'DiverDriver',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'douglas@gmail.com',
        firstName: 'Doug',
        lastName: 'Smith',
        username: 'FlyAway',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
