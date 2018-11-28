const express = require('express');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const Article = require('../models/article')

let router = express.Router();

router.get('/new', function (req, res) {
  console.log(1);
  res.render('article/new', {
    title: 'Add New Article',
  })
})
router.get('/:id', function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('article/show', {
      article: article
    })
  })
})
router.get('/:id/edit', function (req, res) {
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
  check('body').isLength({ min: 1 }).withMessage('Body is invalid'),
  check('author').isLength({ min: 1 }).withMessage('Author is invalid')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('article/new', {
      title: 'Add New Article',
      errors: errors.array()
    })
  } else {
    let article = new Article(req.body)
    article.save(err => {
      if (err) {
        console.log(err);
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
router.delete('/:id', (req, res) => {
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
module.exports = router;

