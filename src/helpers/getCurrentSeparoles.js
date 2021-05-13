// eslint-disable-next-line no-unused-vars
const { Guild, Role } = require("discord.js");
const { setSeparoleListV2, getSeparoleListV2 } = require("../DatabaseWrapper");

/**
 * Get all currently present separoles for the guild. 
 * If not present, we will remove the absent separole from the DB. 
 * @param {Guild} guild The Guild object.
 * @param {string[]} separolesList the list of separole IDs from the DB.
 * @returns {Role[]} The list of roles.
 */
async function getCurrentSeparoles(guild, separolesList) {
    if (!separolesList) {
        // eslint-disable-next-line no-param-reassign
        separolesList = (await getSeparoleListV2(guild.id)).separoles;
    }
    if (!separolesList || separolesList.length === 0) {
        return [];
    }
    const roleManager = await guild.roles
    const allRoles = await Promise.all(separolesList
        .map(async separole => roleManager.fetch(separole)))
    const presentSeparoles = allRoles.filter(role => role);
    if (presentSeparoles.length === separolesList.length) {
        return presentSeparoles;
    }
    const roleIds = presentSeparoles.map(role => role.id);
    await setSeparoleListV2(guild.id, roleIds);
    return presentSeparoles;
}

module.exports = getCurrentSeparoles;
