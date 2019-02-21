var MongoClient = require('mongodb').MongoClient
var log         = require('./loggerService');


// DB connection
var instance = null;

// DB url
const _dbUrl = 'mongodb://' +
            process.env.DB_USERNAME + ':' +
            process.env.DB_PASSWORD + '@' +
            process.env.DB_HOST + ':' +
            process.env.DB_PORT + '/' +
            process.env.DB_BASE
            .toString();

exports.url = _dbUrl;

// Connect to the db
exports.connect = function(done) {
    if (instance) { return done(); }

    MongoClient.connect(_dbUrl, { useNewUrlParser: true }, function(err, result) {
        if (err) { return done(err); }
        instance = result;
        done(null, instance);
    })
}

// Get db connection
exports.get = function() {
    return instance;
}

// Close db connection
exports.close = function(done) {
    if (instance) {
        instance.close(function(err, result) {
            instance   = null;
            done(err);
        })
    }
}
