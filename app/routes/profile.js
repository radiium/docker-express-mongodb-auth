var express    = require('express');
var log        = require('winston');
var fileUpload = require('express-fileupload');
var fs         = require('fs');
var User       = require('../models/userModel');
var isLoggedIn = require('../services/authService');
var router     = express.Router();

const userImageDir = '/app/public/images/users/';


//-----------------------------------------------------------------------------
// GET Profile page
router.get('/profile', isLoggedIn, function(req, res) {
    var data    = {};
    data.title  = 'profile';
    data.type   = 'profile';
    data.isAuth = req.isAuthenticated();
    data.edit   = false;
    data.user   = User.getSafeUserData(req);


    res.render('index', { data: data });
});

//-----------------------------------------------------------------------------
// PUT update Profile
router.put('/profile', isLoggedIn, function(req, res) {
    log.info('===> Profile edit');

    var data     = {};
    var username = req.body.username;
    var password = req.body.password;

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
            //log.info(data.msg);
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

    var data     = {};
    var username = req.body.username;
    var password = req.body.password;


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

        // Delete user
        } else {
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
});


//-----------------------------------------------------------------------------
// POST profile image
router.post('/profile/userimage', function(req, res) {
    log.info('===> Profile upload user image');

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let username = req.user.username;
    let fileName = username + '-' + req.files.file.name;
    let file     = req.files.file;

    // Remove old user image
    let data = removeUserImage(username)
    if (data.status === 'error') {
        return res.status(500).send(data);
    } else {
        data = {};
    }

    // Use the mv() method to place the file somewhere on your server 
    file.mv(userImageDir + fileName, function(err) {
        if (err) {
            data.status = 'error';
            data.msg    = err;
            log.info(data.msg);
            return res.status(500).send(data);
        }

        // Update user
        var userData = {};
        userData.userimage = fileName;

        User.update(username, userData, function(err, user) {
            // Error
            if (err) {
                data.status = 'error';
                data.msg    = err;
                log.info(data.msg);
                return res.status(500).send(data);
            }
        });

        data.status = 'success';
        return res.status(200).send(data);
    });
});

//-----------------------------------------------------------------------------
// DELETE profile image
router.delete('/profile/userimage', function(req, res) {
    log.info('===> Profile delete user image');

    var data = removeUserImage(req.user.username);
    if (data.status !== 'success') {
        return res.status(500).send(data);
    }
    return res.status(200).send(data);

});


function removeUserImage(username) {
    log.info('remove file image');
    var data = {};

    // Find User
    User.getByName(username, function(err, user) {
        // Error
        if (err) {
            data.status = 'error';
            data.msg    = err;
            log.info(data.msg);
            return data;
        }

        // User not found
        if (!user) {
            data.status = 'error';
            data.msg    = 'User not found';
            log.info(data.msg);
            return data;
        }

        //let userimage = req.user.userimage;
        let userimage = user.userimage;

        // Remove image file
        fs.readdir(userImageDir, function(err, filesList) {
            // Error
            if (err) {
                data.status = 'error';
                data.msg    = err;
                log.info(data.msg);
                return data;
            }

            for (var i = 0; i < filesList.length; i++) {
                var file = filesList[i];

                if (file === userimage) {
                    log.info('File found, remove file...');
                    var filePath = userImageDir + userimage;
                    fs.unlinkSync(filePath);
                }
            }
        });

        // Remove userimage field in db
        var userData = {};
        userData.userimage = '';
        User.update(username, userData, function(err, user) {
            // Error
            if (err) {
                data.status = 'error';
                data.msg    = err;
                log.info(data.msg);
                return data;
            }
        });
    });

    data.status = 'success';
    return data;
}


module.exports = router;
