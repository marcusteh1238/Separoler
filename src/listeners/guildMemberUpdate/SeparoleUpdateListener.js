const SeparoleHandler = require("../../SeparoleHandler")

async function SeparoleUpdateListener(oldMember, newMember) {
    return SeparoleHandler(newMember.guild, newMember);
}

module.exports = SeparoleUpdateListener;
