var winston = require('winston');

// Settup logger
module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logfile.log' })
    ]
});
