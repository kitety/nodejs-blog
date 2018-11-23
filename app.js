const express = require('express')
const path = require('path')
const app = express()
// 设置模板引擎路径
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  let articles = [
    {
      id: 1,
      title: 'title 1',
      auther: 'kitety'
    },
    {
      id: 2,
      title: 'title 2',
      auther: 'kitety'
    },
    {
      id: 3,
      title: 'title 3',
      auther: 'kitety'
    }
  ]
  res.render('index', {
    title: 'Hello World',
    articles: articles
  })
})
app.get('/articles/new', function (req, res) {
  res.render('new')
})
app.listen(5000, () => {
  console.log('The server is listening on port 5000');
})
