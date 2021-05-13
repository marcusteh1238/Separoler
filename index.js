require("dotenv-safe").config();

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

DiscordClient.login(process.env.BOT_TOKEN);
