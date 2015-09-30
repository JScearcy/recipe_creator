var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var expressValidator = require('express-validator');
var customValidators = require('./custom_modules/custom-validators');

var routes = require('./routes/index');
var grains = require('./routes/grains');
var hops = require('./routes/hops');
var yeasts = require('./routes/yeast');
var register = require('./routes/register');
var login = require('./routes/login');
var recipes = require('./routes/auth/recipes');
var catchall = require('./routes/catchall');
var unwanted = require('./routes/unwanted');

var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/userdata')
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');
});
// If an error happens
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// If the  connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: customValidators
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/private/*', expressJwt({secret: process.env.SECRET}));
app.use('/private/recipes', recipes)
app.use('/private', express.static(path.join(__dirname, 'private')));

app.use('/', routes);
app.use('/grains', grains);
app.use('/hops', hops);
app.use('/yeasts', yeasts);
app.use('/register', register);
app.use('/loginauth', login);
app.use('/administrator/*', unwanted);
app.use('/*', catchall);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
