require("express-async-errors");
const winston = require('winston');


module.exports = function () {
  
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
      // new winston.transports.File({ filename: "error.log", level:'error' }),
      new winston.transports.File({filename:'combined.log' , level:'info'})
    ]
  });

  logger.stream={
    write:(info)=>{
      logger.info(info);
    }
  }
  

  process.on("uncaughtException", (ex) => {
    console.log("got an uncaught exception");
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("got an uncaught exception");
    process.exit(1);
  });


};
