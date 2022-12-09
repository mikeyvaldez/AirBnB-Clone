const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]


// add image to review based reviewId
router.post('/:reviewId/images', requireAuth, async(req, res) => {
  //first get the review based on the review id
  const { url } = req.body;
  const myReview = await Review.findOne({
    where: {
      id: req.params.reviewId,
      userId: req.user.id
    }
  })

  if(!myReview){
    res.statusCode = 404;
    res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  const reviewId = req.params.reviewId;

  // check to make sure number of images is no more than 10.
  const imagesCount = await ReviewImage.findAll({
    where: { reviewId }
  })
  console.log(imagesCount)

  if(imagesCount.length >= 10){
    res.statusCode = 403;
    res.json({
      "message": "Maximum number of images for this resource was reached",
      "statusCode": 403
    })
  }

  const newReviewImage = await ReviewImage.create({
    reviewId,
    url
  })

  const finalReviewImage = await ReviewImage.findByPk(newReviewImage.id, {attributes: ["id", "url"]})
  return res.json(finalReviewImage)
})

module.exports = router;
