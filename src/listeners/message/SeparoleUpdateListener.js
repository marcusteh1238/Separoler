const SeparoleHandler = require("../../SeparoleHandler")

async function SeparoleUpdateListener(message) {
    if (!message.member) {
        return null;
    }
    return SeparoleHandler(message.guild, message.member)
}

module.exports = SeparoleUpdateListener
