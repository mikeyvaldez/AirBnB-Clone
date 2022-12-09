'use strict';

// add to all seeders and migrations
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;       // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'review1url'
      },
      {
        reviewId: 2,
        url: 'review2url'
      },
      {
        reviewId: 3,
        url: 'review3url'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {})
  }
};
