require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(methodOverride('_method'));
app.use(helmet());

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30 // session expires after 30 min
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  console.log(`User is ${req.user ? req.user.name : "not logged in"}`);
  res.render('index');
});

app.use('/profile', isLoggedIn, require('./controllers/profile'));
app.use('/auth', require('./controllers/auth'));
// app.use('/', require('./controllers/test'));
app.use('/results', require('./controllers/results'));
app.use('/journals', require('./controllers/journals'));

var server = app.listen((process.env.PORT || 3000), () => console.log('🎻 Listening 🎻'));

module.exports = server;

