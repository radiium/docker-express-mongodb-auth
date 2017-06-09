var express  = require('express');
var passport = require('passport');
var flash    = require("connect-flash");
var log      = require('winston');
var User     = require('../models/userModel');
var router   = express.Router();



//-----------------------------------------------------------------------------
// GET SignUp page
router.get('/signup', function (req, res) {
    var data = {};
    data.title = 'signup';
    data.type  = 'signup';
    data.isAuth = req.isAuthenticated();

    var msg = req.flash('error')[0];
    if (msg) { data.message = msg; }

    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// POST SignUp 
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));



//-----------------------------------------------------------------------------
// GET Login page
router.get('/login', function (req, res) {
    var data = {};
    data.title = 'login';
    data.type  = 'login';

    var msg = req.flash('error')[0];
    if (msg) { data.message = msg; }

    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// POST Login
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
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
