// Load environment variables
require('dotenv').config({ path: '/app/config/app.env' });

// Module dependencies.
var express       = require('express');
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);
var cookieSession = require('cookie-session')
var path          = require('path');
var fs            = require('fs');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var log           = require('winston');
var helmet        = require('helmet');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var flash         = require("connect-flash");
var fileUpload    = require('express-fileupload');

var mongo         = require('./services/mongoService');  
var passport      = require('passport');  
var LocalStrategy = require('passport-local').Strategy;

var User          = require('./models/userModel');  

var app = express();



//-----------------------------------------------------------------------------
// Setup environment variables NODE_ENV=development
if (process.env.NODE_ENV === 'development') {
    log.info('[SERVER] Running in \'development\' mode');
    //dotenv.config({ path: './config/environment/dev.env' });
    app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined) {
    log.info('[SERVER] Running in \'production\' mode');
    //dotenv.config({ path: '/app/config/environment/prod.env' });
    app.use(logger('common'));
}



//-----------------------------------------------------------------------------
// Initialization
log.info('[SERVER] General Configuration');



//-----------------------------------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', false);



//-----------------------------------------------------------------------------
// Path setup
app.use(express.static(path.join(__dirname, 'public') ));//, { redirect : false }));
//app.use(favicon(path.join('./public/favicon.ico')))



//-----------------------------------------------------------------------------
// Tools
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(fileUpload());



//-----------------------------------------------------------------------------
// Test MongoDB connection
mongo.connect(function(err, db) {
    if (err) {
        log.info('[SERVER] [MongoDB] Test connection => error');
        process.exit(1)
    } else {
        log.info('[SERVER] [MongoDB] Test connection => succes');
        db.close()
    }
});



//-----------------------------------------------------------------------------
// Configure session
require('./config/passport');
app.set('trust proxy', 1);

var expireDate = new Date(Date.now() + 7200000);

app.use(session({
    secret: process.env.SECRET,
    name : 'SupaCookie',
    resave: false,
    saveUninitialized: false,

    cookie : {
        httpOnly: true,
        maxAge: 7200000,
        expires: expireDate
    },
    
    store: new MongoStore({
        url: mongo.url,
        collection: 'session', 
        auto_reconnect: true
    })
}));



//-----------------------------------------------------------------------------
// passport config
require('./config/passport')(passport);
app.use(passport.initialize());  
app.use(passport.session());



//-----------------------------------------------------------------------------
// Routes Configuration
log.info('[SERVER] Routes Configuration');

app.use(require('./routes/index'));
app.use(require('./routes/profile'));
app.use(require('./routes/login'));



//-----------------------------------------------------------------------------
// error handler

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
    var data = {};
    data.title   = 'error';
    data.type    = 'error';
    data.isAuth  = req.isAuthenticated();
    data.message = err.message;
    //data.error   = req.app.get('env') === 'development' ? err : {};
    data.error   = req.app.get('env') === 'production' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('index', {data: data});
});

module.exports = app;
