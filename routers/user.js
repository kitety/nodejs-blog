const express = require('express');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const Article = require('../models/article')

let router = express.Router();

router.get('/register', function (req, res) {
  res.render('user/new', {
    title: 'Register',
  })
})

module.exports = router;

