const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat,
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' }),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

module.exports = logger;