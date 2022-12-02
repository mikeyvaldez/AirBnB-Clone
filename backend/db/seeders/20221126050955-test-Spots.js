'use strict';

let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // define your shcema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.765358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "133 Lovelend Street",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 41.2830812,
        lng: -126.9639876,
        name: "Browser Ville",
        description: "You can search for anything here",
        price: 243
      },
      {
        ownerId: 3,
        address: "456 BigFoot Avenue",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 15.7890254,
        lng: -116.6784576,
        name: "Browser Ville",
        description: "You can search for anything here",
        price: 175
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
