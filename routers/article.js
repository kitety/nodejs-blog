const express = require('express');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const Article = require('../models/article')
const User = require('../models/user')


let router = express.Router();

// 要做权限控制-> 很多地方用到:中间件
router.get('/new', ensureAuthenticated, function (req, res) {
  res.render('article/new', {
    title: 'Add New Article',
  })
})
router.get('/:id', function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render('article/show', {
        article: article,
        author: user.name
      })
    })
  })
})
router.get('/:id/edit', ensureAuthenticated, function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('article/edit', {
      title: 'Edit',
      article: article
    })
  })
})
router.use(bodyParser.urlencoded({ extended: false }))
router.post('/create', [
  check('title').isLength({ min: 1 }).withMessage('Title is invalid'),
  check('body').isLength({ min: 1 }).withMessage('Body is invalid')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('article/new', {
      title: 'Add New Article',
      errors: errors.array()
    })
  } else {
    let article = new Article(req.body)
    // 作者
    article.author=req.user._id
    article.save(err => {
      if (err) {
        req.flash("danger", "Article Add Failed");
      } else {
        req.flash("success", "Article Added");
        res.redirect('/')
      }
    })
  }
})
router.post('/update/:id', (req, res) => {
  let query = { _id: req.params.id }
  Article.updateOne(query, req.body, err => {
    if (err) {
      console.log(err);
      req.flash("danger", "Article Can't Be Found!");
    } else {
      req.flash("success", "Article Edited!");
      res.redirect('/')
    }
  })
})
router.delete('/:id', ensureAuthenticated, (req, res) => {
  let query = { _id: req.params.id }
  Article.deleteOne(query, err => {
    if (err) {
      console.log(err);
      req.flash("danger", "Article Deleted Failed");
      res.send({ message: 'fail' })
      return
    }
    req.flash("success", "Article Deleted Success");
    res.send({ message: 'success' })
  })
})
// 中间件
function ensureAuthenticated(req,res,next){
  //passport 提供
  if (req.isAuthenticated()) {
    next()
  }else{
    req.flash('danger','Please Login');
    res.redirect('/user/login')
  }

}
module.exports = router;

