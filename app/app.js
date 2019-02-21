// Load environment variables
require('dotenv').config({ path: '/app/config/app.env' });

// Module dependencies.
var express       = require('express');
var cors          = require('cors');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var helmet        = require('helmet');
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);
var passport      = require('passport');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var flash         = require("connect-flash");
var fileUpload    = require('express-fileupload');

var mongo         = require('./services/mongoService');
var log           = require('./services/loggerService');
var User          = require('./models/userModel');

var app = express();

//-----------------------------------------------------------------------------
// Express app config

var isProd = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined);
log.info(`[SERVER] Running in '${isProd ? 'production' : 'development'}' mode`);

app.use(logger(isProd ? 'dev' : 'common'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('trust proxy', 1);

app.use( express.static(path.join(__dirname, 'public')) );
app.use( favicon(path.join('./public/images/favicon.png')) );

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(flash());
app.use(fileUpload());

// Express session configuration
var sessionOptions = {
    secret: process.env.SECRET,
    name : 'SupaCookie',
    resave: false,
    saveUninitialized: false,
    cookie : {
        httpOnly: true,
        maxAge: 7200000,
        expires: new Date(Date.now() + 7200000)
    },
    store: new MongoStore({
        url: mongo.url,
        collection: 'session',
        auto_reconnect: true
    })
};
app.use(session(sessionOptions));

// Passport configuration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//-----------------------------------------------------------------------------
// Test MongoDB connection

mongo.connect(function(err, instance) {
    if (err) {
        log.info('[SERVER] [MongoDB] Test connection => error');
        process.exit(1)
    } else {
        log.info('[SERVER] [MongoDB] Test connection => succes');
        instance.close()
    }
});

//-----------------------------------------------------------------------------
// Routes Configuration

app.use(require('./routes/index'));
app.use(require('./routes/page'));
app.use(require('./routes/profile'));
app.use(require('./routes/login'));


//-----------------------------------------------------------------------------
// error handler

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    var data = {};
    data.title   = 'error';
    data.type    = 'error';
    data.isAuth  = req.isAuthenticated();
    data.message = err.message;
    data.error   = isProd ? err : {};

    res.status(err.status || 500);
    res.render('index', { data: data });
});

module.exports = app;
