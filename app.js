const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const Article = require('./models/article')
const session = require('express-session')

// 连接数据库 nodejs-blog
mongoose.connect('mongodb://localhost/nodejs-blog', { useNewUrlParser: true });
let db = mongoose.connection;
// 数据库连接的提示
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
let article = require('./routers/article')
let user = require('./routers/user')
// 一定要写好路径
app.use('/article', article)
app.use('/user', user)
app.get('/', function (req, res) {
  Article.find({}, (err, articles) => {
    res.render('article/index', {
      title: 'Hello World',
      articles: articles
    })
  })
})
app.listen(5000, () => {
  console.log('The server is listening on port 5000');
})
