var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var novelinfo = require('./routes/novelinfo');
var novelsection = require('./routes/novelsection');
var viewsection=require('./routes/viewsection');
var viewnovel=require('./routes/viewnovel');
var bookstore=require('./routes/bookstore');
var bbs=require('./routes/bbs');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '12345',
    name: 'name',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true
}));


app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/novelinfo', novelinfo);
app.use('/novelsection', novelsection);
app.use('/viewsection', viewsection);
app.use('/viewnovel', viewnovel);
app.use('/bookstore', bookstore);
app.use('/bbs', bbs);
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
      //res.send('您正在尝试非法入侵');
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
