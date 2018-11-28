const express = require('express');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const User = require('../models/user')

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))
router.get('/register', function (req, res) {
  res.render('user/new', {
    title: 'Register',
  })
})
// 密码验证
router.post('/register', [
  check('name').isLength({ min: 1 }).withMessage('Name is invalid'),
  check('email').isLength({ min: 1 }).withMessage('Email is invalid'),
  check('username').isLength({ min: 1 }).withMessage('Username is invalid'),
  check('password').isLength({ min: 1 }).withMessage('Password is invalid'),
  check("password", "invalid password")
    .isLength({ min: 1 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('user/new', {
      errors: errors.array()
    })
  } else {
    let user = new User(req.body)
    user.save(err => {
      if (err) {
        console.log(err);
        req.flash("danger", "User Add Failed");
      } else {
        req.flash("success", "User Added");
        res.redirect('/')
      }
    })
  }
})

module.exports = router;

