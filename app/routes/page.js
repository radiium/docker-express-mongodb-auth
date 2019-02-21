var express = require('express');
var log     = require('../services/loggerService');
var User    = require('../models/userModel');

var router  = express.Router();

//-----------------------------------------------------------------------------
// GET page
router.get('/page', function(req, res, next) {
    log.info('=> Get /page');

    var data    = {};

    data.title  = 'page';
    data.type   = 'page';

    data.isAuth = req.isAuthenticated();
    data.user = User.getSafeUserData(req);

    res.render('index', {data: data});
});


module.exports = router;
