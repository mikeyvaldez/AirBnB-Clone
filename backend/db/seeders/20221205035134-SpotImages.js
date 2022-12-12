'use strict';

// add to all seeders and migrations
let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'url1',
        preview: true,
      },{
        spotId: 2,
        url: 'url2',
        preview: true,
      },{
        spotId: 3,
        url: 'url3',
        preview: true,
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    },{});
  }
};
