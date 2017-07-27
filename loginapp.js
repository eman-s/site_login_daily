const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

//configure mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//configure body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));

//config public to be served statically
app.use(express.static('public'));


app.use(session({
  secret: '1C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));

let userInfo = {
  'username': 'bob',
  'password': 'green'
}


//redirect to either restricted content or login page, depending on login status
app.get('/', function(req, res) {
  if (req.session && req.session.admin) {
    res.redirect('/content');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  if (req.body.username === userInfo.username && req.body.password === userInfo.password) {
    req.session.admin = true;
    res.redirect('/');
  }
  console.log(req.body);
});


var auth = function(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.sendStatus(401);
  }
}

app.get('/content', auth, function(req, res) {
  let username = req.body.username;
  res.render('content', {userInfo: userInfo});
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.render('cya');
});

app.listen(3000, function() {
  console.log("A - Ω");
});
