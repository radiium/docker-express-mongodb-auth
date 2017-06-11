var mongo  = require('../services/mongoService');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var log    = require('winston');


//-----------------------------------------------------------------------------
// Object user
function User(user) {
    this.id        = user.id;
    this.username  = user.username;
    this.usermail  = user.usermail;
    this.password  = user.password;
    this.userimage = user.userimage;
}

module.exports = User;


//-----------------------------------------------------------------------------
// save user data.
User.prototype.save = function(callback) {
    var user = {
        id:        this.id,
        username:  this.username,
        usermail:  this.usermail,
        password:  this.password,
        userimage: this.userimage
    };

    var db = mongo.get();
    db.collection('users', function(err, collection) {
        if(err) { return callback(err); }
        collection.insert(user, {safe: true}, function(err, user) {
            callback(err, user); // return user data if success.
        });
    });
};

//-----------------------------------------------------------------------------
// Update user infos
User.update = function(username, user, callback) {
    var db = mongo.get();
    db.collection('users', function(err, collection) {
        if (err) { return callback(err); }
        collection.update(
        { username: username },
        { $set : user },
        function(err) {
            if (err) { return callback(err); }
            callback(err);
        });
    });
};

//-----------------------------------------------------------------------------
// Delete user
User.delete = function(username, callback) {
    var db = mongo.get();
    db.collection('users', function(err, collection) {
        if (err) { return callback(err); }
        collection.remove(
        { username: username },
        { safe: true },
        function(err) {
            if (err) { return callback(err); }
            callback(err);
        });
    });
};


//-----------------------------------------------------------------------------
// Get user data by Name
User.getByName = function(username, callback) {
    var db = mongo.get();
    db.collection('users').findOne({username: username }, function(err, user) {
        if (!user) { return callback(); }
        log.info('getByName')
        //log.info(user)
        return callback(null, new User(user));
    });
};

//-----------------------------------------------------------------------------
// Get user data by ID
User.getById = function(id, callback) {
    var db = mongo.get();
    db.collection('users').findOne({id: id }, function(err, user) {
        if (!user) { return callback(); }
        log.info('getById')
        //log.info(user)
        return callback(null, new User(user));
    });
};

//-----------------------------------------------------------------------------
// Check if username or usermail exist
User.check = function(username, usermail, callback) {
    var db = mongo.get();
    db.collection('users', function(err, collection) {
        if(err) { return callback(err); }
        collection.findOne({ $or : [
            { username: username },
            { usermail: usermail }
        ]},
        function(err, doc) {
            if(doc) { callback(err, new User(doc)); }
            else { callback(err, null); }
        });
    });
};



//-----------------------------------------------------------------------------
// Utils

// Generate password hash
User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Compare 2 password hash
User.validPassword = function(password, password2) {
    //return bcrypt.compareSync(password, this.password);
    return bcrypt.compareSync(password, password2);
};

// Generaterandom ID
User.generateRandomId = function() {
    return crypto.randomBytes(12).toString('hex');
}
