const { BOT_ID, BOT_PERMISSIONS } = require("../helpers/constants");
const Plugin = require("../structs/Plugin");

async function handle(message) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${BOT_ID}&permissions=${BOT_PERMISSIONS}&scope=bot`
    return message.channel.send({
        content: "Thank you for using Separoler!",
        embed: {
            title: "Invite Me to your Server!",
            description: `Click on [this link](${inviteLink}) to invite me to your server.`
        }
    });
}

const InvitePlugin = new Plugin({
    name: "invite",
    aliases: ["inv", "separoler"],
    handle
});

module.exports = InvitePlugin;
