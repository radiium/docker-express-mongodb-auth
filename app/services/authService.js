var log = require('winston');

// route middleware to make sure a user is logged in
module.exports = function isLoggedIn(req, res, next) {
    log.info('=> isLoggedIn');
    //log.info(req.isAuthenticated());
    //log.info(req.session);
    
    if (req.isAuthenticated()) {
        log.info('Already authenticated');
        return next();
    }
    res.redirect('/login');
}