'use strict';

//add to all seed and migrations
let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA   // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: "Loved my experience. Great all round!",
        stars: 4.5
      },
      {
        spotId: 1,
        userId: 1,
        review: "This place is amazing",
        stars: 4.5
      },
      {
        spotId: 1,
        userId: 1,
        review: "Excellent. Will be returning.",
        stars: 4.5
      },
      {
        spotId: 1,
        userId: 1,
        review: "Unreal experience, my family and I will be coming back. Highly recommend",
        stars: 4.5
      },
      {
        spotId: 1,
        userId: 1,
        review: "Crazy how a place can feel so much like home or you want it to be your home.",
        stars: 4.5
      }
    ],{})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1]}
    },{});
  }
};
