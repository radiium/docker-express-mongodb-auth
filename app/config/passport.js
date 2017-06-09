var LocalStrategy = require('passport-local').Strategy;
var flash         = require("connect-flash");
var User          = require('../models/userModel');
var log           = require('winston');


module.exports = function(passport) {

    // Serialize User
    passport.serializeUser(function(user, done) {
        log.info(user);
        done(null, user.id);
    });

    // Deserialize User
    passport.deserializeUser(function(id, done) {
        User.getById(id, function(err, user) {
            done(err, user);
        });
    });

    // SignUp Localstrategy
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, username, password, done) {
        var usermail = req.body.usermail;

        process.nextTick(function(usermail) {
            User.check(username, usermail, function(err, user) {
                // Error
                if (err) {
                    log.info(err);
                    return done(err);
                }

                // User already exist
                if (user) {
                    var msg = 'User already exist';
                    log.info(msg);
                    return done(null, false, {message: msg});
                } else {
                    var newUser = {};
                    newUser.id       = User.generateRandomId();
                    newUser.username = username;
                    newUser.usermail = req.body.usermail;
                    newUser.password = User.generateHash(password);
                    var nUser = new User(newUser);
                    nUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));


    // Login Localstrategy
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true,
    },
    function(req, username, password, done) {
        User.getByName(username, function(err, user) {
            // Error
            if (err) {
                log.info(err);
                return done(err);
            }

            var msg = '';
            // User not found
            if (!user) {
                msg = 'User not found';
                log.info(msg);
                return done(null, false, {message: msg});
            }

            // Password not match
            if (!User.validPassword(password, user.password)) {
                msg = 'Invalid password';
                log.info(msg);
                return done(null, false, {message: msg});
            }

            log.info('Authentication done');
            return done(null, user);
        });
    }));
};
