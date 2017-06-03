var express = require('express');
var log     = require('winston');
var router  = express.Router();


//-----------------------------------------------------------------------------
// GET Entry point
router.get('/', function(req, res, next) {
    log.info('=> Get /');

    var data = {};
    data.title = 'home';
    data.type  = 'home';
    data.isAuth = req.isAuthenticated();

    res.render('index', {data: data});
});


//-----------------------------------------------------------------------------
// GET 404
router.get('/404', function(req, res) {
    log.info('=> Get 404');

    var data = {};
    data.title = '404';
    data.type  = '404';
    data.isAuth = req.isAuthenticated();

    res.render('index', {data: data});
});

module.exports = router;
