const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {check } = require('express-validator');
const {Op} = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
  check('address')
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .isDecimal()
    .withMessage('Longitude is not valid'),
  check('name')
    .isLength({max:50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .notEmpty()
    .withMessage('Description is  required'),
  check('price')
    .notEmpty()
    .isInt()
    .withMessage('Price per day is required'),
  handleValidationErrors
]



// GET all spots
router.get('/', async (req, res) => {

  let spots = await Spot.findAll({
    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
  })

  res.status(200)
  res.json(spots)
});

// Add image to spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url , preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId)

  if(!spot){
    res.statusCode = 404;
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  const spotId = req.params.spotId;

  const newSpotImage = await SpotImage.create({
    spotId,
    url,
    preview
  })

  const newImage = await SpotImage.findByPk(newSpotImage.id, {attributes:["id","url","preview"]})
  return res.json(newImage);
})

// GET all spots of current user
router.get('/current', requireAuth, async (req, res) => {
  const ownerId = +req.user.id;
  const spots = await Spot.findAll({where: {ownerId}});
  console.log()

  let currentUserSpots = [];

  spots.forEach( spot => {
    currentUserSpots.push(spot.toJSON())
  })

  res.status(200)
  res.json({Spot:currentUserSpots})
});



// Create a spot
router.post('/', validateSpot, requireAuth, async (req, res, next) => {
  const ownerId = req.user.ownerId

  const newSpot = await Spot.create({ownerId, ...req.body})
  res.json(newSpot)
})



module.exports = router;
