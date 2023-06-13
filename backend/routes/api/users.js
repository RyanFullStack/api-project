const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists()
    .isLength({min: 2})
    .withMessage('Please enter a first name.'),
  check('lastName')
    .exists()
    .isLength({min: 2})
    .withMessage('Please enter a last name.'),
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

const checkEmail = async(req, res, next) => {
  const {email} = req.body

  if (email) {
  const useremail = await User.findAll({where: {email: email}})

  if (useremail.length) {
    const err = new Error()
    err.errors = {email: "User with that email already exists"}
    err.status = 500
    err.message = "User already exists"
    next(err)
  }
}
  next()
}

const checkUser = async(req, res, next) => {
  const {username} = req.body

  if (username) {
  const user = await User.findAll({where: {username: username}})

  if (user.length) {
    const err = new Error()
    err.errors = {username: "User with that username already exists"}
    err.status = 500
    err.message = "User already exists"
    next(err)
  }
}
  next()
}


// Sign up
router.post(
    '/',
    checkEmail,
    checkUser,
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );



module.exports = router;
