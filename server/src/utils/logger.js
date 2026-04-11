const winston = require('winston');

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cura-ai-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), align(), logFormat),
    })
  );
}

module.exports = logger;
