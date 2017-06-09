var mongo  = require('../services/mongoService');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var log    = require('winston');



function User(user) {
    this.id       = user.id;
    this.username = user.username;
    this.usermail = user.usermail;
    this.password = user.password;
}

module.exports = User;



// save user data.
User.prototype.save = function(callback) {
    var user = {
        id:       this.id,
        username: this.username,
        usermail: this.usermail,
        password: this.password
    };

    var db = mongo.get();
    db.collection('users', function(err, collection) {
        if(err) { return callback(err); }
        collection.insert(user, {safe: true}, function(err, user) {
            callback(err, user); // return user data if success.
        });
    });
};

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


// read user data.
User.getByName = function(username, callback) {
    var db = mongo.get();
    db.collection('users').findOne({username: username }, function(err, user) {
        if (!user) { return callback(); }
        log.info('getByName')
        //log.info(user)
        return callback(null, new User(user));
    });
};

// read user data.
User.getById = function(id, callback) {
    var db = mongo.get();
    db.collection('users').findOne({id: id }, function(err, user) {
        if (!user) { return callback(); }
        log.info('getById')
        //log.info(user)
        return callback(null, new User(user));
    });
};


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



/*

Users = function(app, mongo) {

    // Find user by ID
    Users.prototype.findById = function(id, done) {
        var query = {_id: id};
        return this.findOne(query, done);
    }

    // Find one user by query
    Users.prototype.findOne = function(query, done) {
        var user = db.collection('users').findOne(query);
        if (!user) {
            return done('User not found', null);
        }
        return done(null, user);
    }

    // Generate password hash
    Users.prototype.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // Compare 2 password hash
    Users.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    Users.prototype.addUser = function() {
        console.log("add user");
    }

    Users.prototype.getAll = function() {
        return "all users " + mongo.dbUsers;
    }
}

module.exports = Users;
*/