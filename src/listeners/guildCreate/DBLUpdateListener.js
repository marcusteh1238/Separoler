const updateDBLStats = require("../../DiscordBotListStatsUpdater");

async function DBLUpdateListener() {
    return updateDBLStats();
}

module.exports = DBLUpdateListener
