const express = require('express');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
//https://zhuanlan.zhihu.com/p/35156547
const passport = require('passport')


let router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))
// 渲染注册页面
router.get('/register', function (req, res) {
  res.render('user/new', {
    title: 'Register',
  })
})
//渲染登录页面
router.get('/login', function (req, res) {
  res.render('user/login', {
    title: 'Login',
  })
})

// 注册接口
router.post('/register', [
  check('name').isLength({ min: 1 }).withMessage('Name is invalid'),
  check('email').isLength({ min: 1 }).withMessage('Email is invalid'),
  check('username').isLength({ min: 1 }).withMessage('Username is invalid'),
  check('password').isLength({ min: 1 }).withMessage('Password is invalid'),
  // 两次密码验证
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
    // 需要加密
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
          return;
        }
        user.password = hash;
        user.save(err => {
          if (err) {
            console.log(err);
            req.flash("danger", "User Add Failed");
          } else {
            req.flash("success", "User Added");
            res.redirect('/user/login')
          }
        })
      });
    });
  }
})
//登录接口
router.post('/login', (req, res,next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
    successFlash:"Welcome!"
  })(req, res, next)
})

module.exports = router;

