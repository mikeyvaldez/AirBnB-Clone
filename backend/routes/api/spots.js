const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
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

const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
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
  // console.log()

  let currentUserSpots = [];

  spots.forEach( spot => {
    currentUserSpots.push(spot.toJSON())
  })

  res.status(200)
  res.json({Spot:currentUserSpots})
});


// GET details of a Spot by Id
router.get('/:spotId', async (req, res) => {
  const spots = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"]
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"]
      }
    ]
  });

  if(!spots){
    res.statusCode = 404;
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  } else {

    const numReviews = await Review.count({
      where: spots.id
    })

    const spotRatings = await Review.findAll({
      where: {
        spotId: spots.id
      },
      attributes: ["stars"]
    })

    let stars = 0;
    spotRatings.forEach( rating => {
      stars += rating.stars
    })

    const avgStarRating = stars / spotRatings.length;

    let avgRating = "no reviews";

    if(avgStarRating){
      avgRating = avgStarRating
    }

    const data = {
      id: spots.id,
      ownerId: spots.ownerId,
      address: spots.address,
      city: spots.city,
      state: spots.state,
      country: spots.country,
      lat: spots.lat,
      lng: spots.lng,
      name: spots.name,
      description: spots.description,
      price: spots.price,
      createdAt: spots.createdAt,
      updatedAt: spots.updateAt,
      numReviews: numReviews,
      avgStarRating: avgRating,
      SpotImage: spots.SpotImage,
      Owner: spots.Owner
    };

    res.json(data);

  }

})

//Edit a spot
router.put('/:spotId', validateSpot, requireAuth, async (req, res) => {
  //find the spot with spotId
  const spot = await Spot.findByPk(req.params.spotId)

  //check to make sure the user is also the owner of the spot -> basically the user id === ownerId.
  //if the spot does not exist, return a 404 error with the message and statusCode in the readme.
  if(!spot){
    res.statusCode = 404;
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  } else if (spot.ownerId === req.user.id){

    // if thats good, update the spot record and return the data with all  the attributes included in the readme.
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if(address) spot.address = address
    if(city) spot.city = city
    if(state) spot.state = state
    if(country) spot.country = country
    if(lat) spot.lat = lat
    if(lng) spot.lng = lng
    if(name) spot.name = name
    if(description) spot.description = description
    if(price) spot.price = price

    await spot.save()
    res.json(spot)
    // if validate spot is violated, return an arror response with status code 400. -> thats validateSpot
  } else {
    res.statusCode = 403
    res.json({
      "message": "You are not authorized",
      "statusCode": 403
    })
  }
})

//Create a review for spot based on spot id
// make sure user is authenticated
router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res) => {
  // find the spot based on the spot id -> make spot variable
  //make sure review is valid -> make a new validReview variable, just like 90-38 in spots.js
  const { review, stars } = req.body;
  const spot = await Spot.findByPk(req.params.spotId)

  // make sure the spot exists -> check if spot variable is falsey
  if(!spot){
    res.statusCode = 404;
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  const spotId = req.params.spotId;
  const userId = req.user.id;

  // check if review from current user already exists.
  const myReview = await Review.findOne({
    where: {
      spotId,
      userId
    }
  });

  if(myReview){
    res.statusCode = 403;
    res.json({
      "message": "User already has a review for this spot",
      "statusCode": 403
    })
  }

  const newSpotReview = await Review.create({
    spotId,
    userId,
    review,
    stars
  });

  res.json(newSpotReview)
})

// Create a spot
router.post('/', validateSpot, requireAuth, async (req, res, next) => {
  const ownerId = req.user.ownerId

  const newSpot = await Spot.create({ownerId, ...req.body})
  res.json(newSpot)
})



module.exports = router;
