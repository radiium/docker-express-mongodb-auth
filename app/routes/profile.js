var express    = require('express');
var log        = require('winston');
var User       = require('../models/userModel');
var isLoggedIn = require('../services/authService');
var router     = express.Router();



//-----------------------------------------------------------------------------
// GET Profile page
router.get('/profile', isLoggedIn, function(req, res) {
    var data = {};
    data.title = 'profile';
    data.type  = 'profile';
    data.user  = req.user;
    data.isAuth = req.isAuthenticated();
    data.edit = false;

    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// PUT update Profile
router.put('/profile', isLoggedIn, function(req, res) {
    log.info('===> Profile edit');

    var username = req.body.username;
    var password = req.body.password;

    var data = {};

    User.getByName(username, function(err, user) {
        // Error
        if (err) {
            data.status = 'error';
            data.msg    = err;
            log.info(data.msg);
            return res.send(data);
        }

        // User not found
        if (!user) {
            data.status = 'error';
            data.msg    = 'User not found';
            log.info(data.msg);
            return res.send(data);
        }

        // Password not match
        if (!User.validPassword(password, user.password)) {
            data.status = 'error';
            data.msg    = 'Invalid password';
            log.info(data.msg);
            return res.send(data);

        // Update user
        } else {
            var newUser = {};
            if (req.body.newUsername) { newUser.username = req.body.newUsername; }
            if (req.body.newUsermail) { newUser.usermail = req.body.newUsermail; }
            if (req.body.newPassword) { newUser.password = req.body.newPassword; }

            log.info('newUser');
            log.info(newUser);

            User.update(username, newUser, function(err, user) {
                // Error
                if (err) {
                    data.status = 'error';
                    data.msg    = err;
                    log.info(data.msg);
                    return res.send(data);
                }

                // success
                data.status = 'success';
                return res.send(data);
            });
        }
    });
});


//-----------------------------------------------------------------------------
// DELETE Profile
router.delete('/profile', isLoggedIn, function(req, res) {
    log.info('===> Profile delete')

    var username = req.body.username;
    var password = req.body.password;

    var data = {};

    User.getByName(username, function(err, user) {
        // Error
        if (err) {
            data.status = 'error';
            data.msg    = err;
            log.info(data.msg);
            return res.send(data);
        }

        // User not found
        if (!user) {
            data.status = 'error';
            data.msg    = 'User not found';
            log.info(data.msg);
            return res.send(data);
        }

        // Password not match
        if (!User.validPassword(password, user.password)) {
            data.status = 'error';
            data.msg    = 'Invalid password';
            log.info(data.msg);
            return res.send(data);

        // Update user
        } else {
            
            log.info('user');
            log.info(user._id);

            User.delete(username, function(err, user) {
                // Error
                if (err) {
                    data.status = 'error';
                    data.msg    = err;
                    log.info(data.msg);
                    return res.send(data);
                }

                // success
                data.status = 'success';
                return res.send(data);
            });
        }
    });
    return res.send();
});


module.exports = router;
