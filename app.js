const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const Article = require('./models/article')
const bodyParser = require('body-parser')
const session = require('express-session')
const { check, validationResult } = require('express-validator/check');

// 连接数据库 nodejs-blog
mongoose.connect('mongodb://localhost/nodejs-blog', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', err => {
  console.log(err);
})
db.on('open', () => {
  console.log('Connecting to mongodb!');
})

const app = express()
// express-session
app.use(session({
  secret: 'keyboard-cat-nodejs-blog',
  resave: false,
  saveUninitialized: true
}))
// flash message
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// 静态资源文件夹
app.use(express.static(path.join(__dirname, 'public')))
// 设置模板引擎路径
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  Article.find({}, (err, articles) => {
    res.render('index', {
      title: 'Hello World',
      articles: articles
    })
  })
})
app.get('/articles/new', function (req, res) {
  res.render('new',{
    title: 'Add New Article',
  })
})
app.get('/article/:id', function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('show', {
      article: article
    })
  })
})
app.get('/article/:id/edit', function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit', {
      title: 'Edit',
      article: article
    })
  })
})
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/article/create', [
  check('title').isLength({ min: 1 }).withMessage('Title is invalid'),
  check('body').isLength({ min: 1 }).withMessage('Body is invalid'),
  check('author').isLength({ min: 1 }).withMessage('Author is invalid')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('new', {
      title:'Add New Article',
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
app.post('/article/update/:id', (req, res) => {
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
app.delete('/article/:id', (req, res) => {
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
app.listen(5000, () => {
  console.log('The server is listening on port 5000');
})
