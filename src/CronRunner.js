const cron = require("node-cron");

const cleanup = require("./crons/cleanup");
const logger = require("./helpers/logger");

cron.schedule('*/10 * * * *', () => {
  cleanup().then(() => logger.info({
    msg: "Cleanup successful!"
  })).catch(err => logger.error({
    msg: "Error occurred during cleanup cronjob.",
    err
  }))
});
