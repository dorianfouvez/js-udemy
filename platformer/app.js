var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

// For /api request
var usersRouter = require('./routes/users');

var app = express();

// path engine setup
//app.set('images', path.join(__dirname,'images/'));
//console.log(app.get('images'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// not found in static files, so default to index.html
app.use((req, res, next) => {
  if (!req.path.startsWith("/api/"))
    return res.sendFile(`${__dirname}/public/index.html`);
  next();
});

// use the express-session middleware
// NB : the middleware shall be prior to the router
app.use(
  session({
    secret: "689HiHoveryDi79*",
    resave: false, // default value is true, but using the default has been deprecated...
    saveUninitialized: false, // ditto
  })
);

// initialize the session data
app.use(function (req, res, next) {
  console.log("app.use:: check if the session data shall be initialized");

  if (!req.session.isAuthenticated) {
    console.log("app.use:: !req.session.isAuthenticated");
    req.session.isAuthenticated = false;
  }

  if (!req.session.user) {
    req.session.user = "";
  }

  console.log(
    "app.use()::req.sessionID : ",
    req.sessionID,
    " ",
    req.session.id
  );

  next();
});

// For /api request
app.use('/api/users', usersRouter);

module.exports = app;
