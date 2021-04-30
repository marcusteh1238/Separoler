const pino = require("pino")

const logger = pino(
  {
    level: process.env.LOG_LEVEL,
    redact: {
      paths: [
        "err.req",
        "err.res",
        "err.resp",
        "err.request",
        "err.response",
        "err.bufferedData",
        "err.options",
        "error.req",
        "error.res",
        "error.resp",
        "error.request",
        "error.response",
        "error.bufferedData",
        "error.options"
      ],
      remove: true
    }
  }
);

module.exports = logger;
