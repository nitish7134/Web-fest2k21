var config = require('./config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var passport = require('passport');

const connect = mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  /* other options */
});

connect.then((db) => {
  config.db = db;
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();
app.disable('etag');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Middlewares

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handling CORS Errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use(passport.initialize());

//RENDER FILES WITH NAME
app.use(express.static(path.join(__dirname, 'public'),{index:["index.html","index.htm"]}));

//Get Routers
var usersRouter = require('./routes/users');
var quizRouter = require('./routes/quiz');
var marketRouter = require('./routes/market')


app.use('/users', usersRouter);
app.use('/quiz', quizRouter);
app.use('/market', marketRouter);

//Notification Creator
const Notif = require("./models/notification");
app.get('/notifications', (req, res, next) => {
  Notif.find({}).then(notifs => {
    res.json(notifs);
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
