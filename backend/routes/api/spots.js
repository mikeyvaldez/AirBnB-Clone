const express = require('express');
const router = express.Router();
const { Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');


// GET all spots
router.get('/', async (req, res) => {

  let spots = await Spot.findAll({
    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'avgRating', 'previewImage'],
  })

  res.status(200)
  res.json(spots)
})

// GET all spots owned by Current User


module.exports = router;
