const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid firstName.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid lastName.'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    const emailAlreadyExists = await User.findOne({
      where: { email: email }
    });

    const usernameAlreadyExists = await User.findOne({
      where: { username: username}
    });

    if(emailAlreadyExists){
      res.status(403)
      res.json({
        message: "User already exists",
        statusCode: 403,
        errors: "User with that email already exists"
      })
    } else if(usernameAlreadyExists){
      res.status(403)
      res.json({
        message: "User already exists",
        statusCode: 403,
        errors: "User with that username already exists"
      })
    } else {
      
      const user = await User.signup({ firstName, lastName, email, username, password });

      await setTokenCookie(res, user);

      let myObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: ""
      }

      res.status(200);
      res.json(myObj);
    }
});




module.exports = router;
