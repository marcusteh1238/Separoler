const { getBaseConfig } = require("../../DatabaseWrapper");

async function addGuild(guild) {
    return getBaseConfig(guild.id)
}

module.exports = addGuild;
