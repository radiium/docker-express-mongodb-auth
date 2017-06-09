var MongoClient = require('mongodb').MongoClient
var log         = require('winston');


// DB connection
var state = {
    db: null,
}

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
    if (state.db) { return done(); }

    MongoClient.connect(_dbUrl, function(err, db) {
        if (err) { return done(err); }
        state.db = db;
        done(null, db);
    })
}

// Get db connection
exports.get = function() {
    return state.db;
}

// Close db connection
exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db   = null;
            state.mode = null;
            done(err);
        })
    }
}
