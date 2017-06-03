var LocalStrategy = require('passport-local').Strategy;
var User     = require('../models/userModel');
var log           = require('winston');


module.exports = function(passport) {

    // Serialize User
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize User
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
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

        //if (!user)
        //    return done(null, false, req.flash('loginMessage', 'No user found.'));
            
        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                // Error
                if (err) {
                    log.info(err);
                    return done(err);
                }

                // User not found
                if (user) {
                    log.info('User not found');
                    return done(null, false);
                }
                /*
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                */
                else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.usermail = req.body.usermail;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function(err) {
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
        passReqToCallback : true
    },
    function(req, username, password, done) {
        User.findOne({ 'username' :  username }, function(err, user) {
            // Error
            if (err) {
                log.info(err);
                return done(err);
            }

            // User not found
            if (!user) {
                log.info('User not found');
                return done(null, false);
            }
            /*
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            */


            // Password not match
            if (!user.validPassword(password)) {
                log.info('Invalid password');
                return done(null, false);
            }
            /*
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            */

            log.info('Authentication done');
            return done(null, user);
        });
    }));
};