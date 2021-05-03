// eslint-disable-next-line no-unused-vars
const { GuildMember, Permissions } = require("discord.js");

/**
 * Checks if the user is a separole manager of the guild.
 * @param {GuildMember} member The guild member.
 */
function isSeparoleManager(member) {
    return member.hasPermission(Permissions.FLAGS.MANAGE_GUILD);
}

module.exports = isSeparoleManager;
