const express = require('express')
const path = require('path')
var mongoose = require('mongoose');
const Article = require('./models/acticle')

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
  res.render('new')
})
app.listen(5000, () => {
  console.log('The server is listening on port 5000');
})
