var express       = require('express');
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);
var cookieSession = require('cookie-session')
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var log           = require('winston');
var helmet        = require('helmet');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var dotenv        = require('dotenv');

var mongoose      = require('mongoose');
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

dotenv.config({ path: '/app/config/.env' });



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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());



//-----------------------------------------------------------------------------
// MongoDB
mongoose.Promise = global.Promise;
var options = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect(process.env.DB_URL, options, function(err) {
    if (err) { log.info(err); }
    else     { log.info('Connected to mongodb'); }
});
// Check opened connection
mongoose.connection.on('open', function (err) {
    if (err) { throw err; }
    console.log("Mongoose connection opened on process " + process.pid);
});
// Error handler
mongoose.connection.on('error', function (err) { console.log(err); });
// Reconnect when closed
mongoose.connection.on('disconnected', function () { self.connectToDatabase(); });




//-----------------------------------------------------------------------------
// Authentication
require('./config/passport');
app.set('trust proxy', 1) // trust first proxy
//var expiryDate = new Date( Date.now() + ((60 * 60 * 1000) * 2) ); // 2 hour

var twoHours = 3600000 * 2;

app.use(session({
    secret: process.env.SECRET,
    name : 'SupaCookie',
    resave: false,
    saveUninitialized: false,
    cookie : {
        //domain: process.env.HOST,
        httpOnly: true,
        maxAge: twoHours,
        expires: new Date(Date.now() + twoHours)
    },
    
    store: new MongoStore({
        url: process.env.DB_URL,
        /*
        db: 'express',
        host: 'oceanic.mongohq.com',
        port: 10065,  
        username: 'cm',
        password: 'cm',
        */
        collection: 'session', 
        auto_reconnect:true
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
app.use(require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
