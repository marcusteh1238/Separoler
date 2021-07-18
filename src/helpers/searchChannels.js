const Fuse = require("fuse.js");
// eslint-disable-next-line no-unused-vars
const { Channel } = require("discord.js");

/**
 * Searcues an array of channel IDs for the query string.
 * @param {Channel[]} channels Channels to search through.
 * @param {string} queryString a string or snowflake passed in by the user.
 * @returns {Channel} The channel that best matches the query string.
 */
function searchChannels(channels, queryString) {
    const fromId = channels.find(channel => channel.id === queryString);
    if (fromId) {
        return fromId;
    }
    const fuse = new Fuse(channels, { keys: ["name"], limit: 1 });
    const [result] = fuse.search(queryString);
    if (!result) return result;
    return channels[result.refIndex];
}

module.exports = searchChannels;
