var express  = require('express');
var passport = require('passport');
var log      = require('winston');
var router   = express.Router();

var isLoggedIn = require('../services/authService');




router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//-----------------------------------------------------------------------------
// GET Login page
router.get('/login', function (req, res) {
    var data = {};
    data.title = 'login';
    data.type  = 'login';
    //data.message = 
    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// GET SignUp page
router.get('/signup', function (req, res) {
    var data = {};
    data.title = 'signup';
    data.type  = 'signup';
    data.isAuth = req.isAuthenticated();
    //data.message = 
    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// GET Profile page
router.get('/profile', isLoggedIn, function(req, res) {
    var data = {};
    data.title = 'profile';
    data.type  = 'profile';
    data.user  = req.user;
    data.isAuth = req.isAuthenticated();
    //data.message = 
    res.render('index', { data: data });
});


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}),
function(req) {
  log.info(req);
});

//-----------------------------------------------------------------------------
// Logout endpoint
router.get('/logout', function (req, res) {
    log.info('LOGOUT');
    req.logout();
    res.redirect('/');
});

module.exports = router;


/*
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
*/
