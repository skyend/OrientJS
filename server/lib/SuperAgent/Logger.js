import winston from 'winston';

export default function(filename) {

  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        json: false,
        filename: filename
      })
    ],
  });


  logger.setLevels(winston.config.syslog.levels);

  //logger.exitOnError = true;
  return logger;
};