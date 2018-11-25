const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const Article = require('./models/acticle')
const bodyParser = require('body-parser')

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
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/acticle/create',(req,res)=>{
  let article = new Article(req.body)
  // 新方法 直接放入req.body
  // article.title=req.body.title
  // article.body=req.body.body
  // article.author=req.body.author
  article.save(err=>{
    if (err) {
      console.log(err);
    }else{
      res.redirect('/')
    }
  })
})
app.listen(5000, () => {
  console.log('The server is listening on port 5000');
})
