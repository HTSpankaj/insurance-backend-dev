const { createLogger, format, transports } = require("winston");
const { combine, timestamp, errors, printf } = format;

const logFormat = printf(({ level, timestamp, stack, message }) => {
  const seperator = '-'.repeat(100)
  return `${timestamp} ${level}: ${stack || message} \n${seperator}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-YY HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logger/unhandled-exception.log",
      level: "error",
    }),
  ],
});

module.exports = logger;