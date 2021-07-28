const winston = require("winston");

module.exports = function (err, req, res, next) {
  //in the first argument, we've to set the logging level
  //error => warn => info
  //verbose,debug,silly
  winston.error(err.message, err);

  const logger = winston.createLogger({
    level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
  

  //here, firstly, whenever an error occurs where the error
  //middleware has been passed, starting off, the error message will be thrown out and
  // then the stack trace as part of the err object

  //log the exception
  res.status(500).send("something failed");
};
}
