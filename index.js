require("dotenv-safe").config();

require("./src/CronRunner");

const DiscordClient = require("./src/DiscordClient");
const logger = require("./src/helpers/logger");
const { pool } = require("./src/db/Database");

process.once('SIGUSR2', () => {
    pool.end()
        .then(() => process.kill(0, 'SIGUSR2'))
        .catch(err => {
            logger.error({
                msg: "Error occurred while ending PG connection.",
                err
            });
        });
});

process.on("uncaughtException", err => logger.error(err));
process.on("unhandledRejection", err => logger.error(err));

DiscordClient.login(process.env.BOT_TOKEN);
