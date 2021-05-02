// eslint-disable-next-line no-unused-vars
const { GuildMember, Permissions } = require("discord.js");

/**
 * Checks if the user is a separole manager of the guild.
 * @param {GuildMember} member The guild member.
 */
function isSeparoleManager(member) {
    const highestRole = member.roles.highest;
    return highestRole.permissions.has(Permissions.FLAGS.MANAGE_GUILD, true);
}

module.exports = isSeparoleManager;
