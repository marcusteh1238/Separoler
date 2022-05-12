const { info_lavendar } = require("../helpers/colors");
const { BOT_ID, BOT_PERMISSIONS, PLUGIN_TYPES } = require("../helpers/constants");
const Plugin = require("../structs/Plugin");

async function handle(message) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${BOT_ID}&permissions=${BOT_PERMISSIONS}&scope=bot`
    return message.channel.send({
        content: "Thank you for using Separoler!",
        embeds: [{
            title: "Invite Me to your Server!",
            description: `Click on [this link](${inviteLink}) to invite me to your server.`,
            color: info_lavendar
        }]
    });
}

const InvitePlugin = new Plugin({
    name: "invite",
    aliases: ["inv", "separoler"],
    type: PLUGIN_TYPES[1],
    cooldowns: [1, 1],
    help: {
        description: "Get Separoler's Invite link so you can add me to your server :3",
        usage: "s!invite",
        examples: [
            ["s!invite", "Get my invite link. Now. Do it."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = InvitePlugin;
