import winston from 'winston';

export default function(filename) {
  var options = {
    transports: [
      new winston.transports.Console()
    ]
  };

  if( filename ){
    options.transports.push(new winston.transports.File({
      json: false,
      filename: filename
    }));
  }

  var logger = new winston.Logger(options);


  logger.setLevels(winston.config.syslog.levels);

  //logger.exitOnError = true;
  return logger;
};
