const { addUserToStat } = require("../../DatabaseWrapper");
const SeparoleHandler = require("../../SeparoleHandler")

const { BOT_ID } = process.env;

async function SeparoleUpdateListener(message) {
    addUserToStat(message.author.id);
    if (!message.member) {
        return null;
    }
    // ignore message on first guild join.
    if (message.type === "GUILD_MEMBER_JOIN" && message.author.id === BOT_ID) {
        return null;
    }
    return SeparoleHandler(message.guild, message.member)
}

module.exports = SeparoleUpdateListener
