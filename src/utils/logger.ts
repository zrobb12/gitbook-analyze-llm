import winston from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow'
  }
};

winston.addColors(config.colors);

const logger = winston.createLogger({
  levels: config.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      let logMessage = `${timestamp} [${level}] ${message}`;

      if (Object.keys(metadata).length) {
        logMessage += ` | Metadata: ${JSON.stringify(metadata)}`;
      }

      return logMessage;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
  level: 'custom'
});

export default logger;
