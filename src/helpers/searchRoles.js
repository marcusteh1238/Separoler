const Fuse = require("fuse.js");
// eslint-disable-next-line no-unused-vars
const { Role } = require("discord.js");

/**
 * Searcues an array of role IDs for the query string.
 * @param {Role[]} roles Roles to search through.
 * @param {string} queryString a string or snowflake passed in by the user.
 * @returns {Role} The role that best matches the query string.
 */
function searchRoles(roles, queryString) {
    const fromId = roles.find(role => role.id === queryString);
    if (fromId) {
        return fromId;
    }
    const fuse = new Fuse(roles, { keys: ["name"], limit: 1 });
    const [result] = fuse.search(queryString);
    if (!result) return result;
    return roles[result.refIndex];
}

module.exports = searchRoles;
