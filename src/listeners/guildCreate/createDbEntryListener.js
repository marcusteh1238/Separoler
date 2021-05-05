const { getBaseConfig } = require("../../DatabaseWrapper");
const logger = require("../../helpers/logger");

async function createDbEntryListener(guild) {
    await getBaseConfig(guild.id)
    logger.info({
        msg: "Added new guild.",
        guild: guild.id
    })
}

module.exports = createDbEntryListener;
