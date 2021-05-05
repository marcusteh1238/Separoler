const SeparoleHandler = require("../../SeparoleHandler")

async function SeparoleUpdateListener(oldMember, newMember) {
    const member = newMember || oldMember;
    if (!member) return null;
    return SeparoleHandler(member.guild, member);
}

module.exports = SeparoleUpdateListener;
