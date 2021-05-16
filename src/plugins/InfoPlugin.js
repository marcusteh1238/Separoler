const colors = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const getUserAvatarURL = require("../helpers/getUserAvatarURL");
const Plugin = require("../structs/Plugin");

const description = `I am a small utility bot that handles **__Separ__ator __Role__s**, known as **Separoles**, in your server.

Join the Community Support Server [here](${process.env.SUPPORT_SERVER_INVITE})!
Support me by giving me an upvote on [Discord Bot List](https://discordbotlist.com/bots/separoler/upvote)!`

const fields = [
    {
        name: "What are Separoles?",
        value: "When you have tons of roles that users can equip, we understand that it can be a huge pain to look at. \n\nSetting up **[Separoles](https://www.reddit.com/r/discordapp/comments/a39fap/custom_role_separators/)** allows server owners to create many different types of roles (eg. levelled roles, color roles), without confusing new users when they look at your active members' profile."
    },
    {
        name: "Why use Separoler Bot?",
        value: "**Separoler Bot** (that's me!) helps you automatically manage **Separoles** using different configuration options, so your server moderators have one less thing to worry about when managing the server."
    },
    {
        name: "Get Started Now!",
        value: "Add me to your server with my invite link at `s!invite` or view a list of all my commands with `s!help`."
    }
]


async function handle(message) {
    return message.channel.send({
        embed: {
            title: "Hi, I am Separoler!",
            description,
            fields,
            color: colors.info_lavendar,
            footer: {
                icon_url: getUserAvatarURL(message.author),
                text: `Created by: Markers Duh ʕ •́ᴥ•̀ʔ#1238`
            }
        }
    })
}

const InfoPlugin = new Plugin({
    name: "info",
    aliases: ["about", "aboutme"],
    type: PLUGIN_TYPES[1],
    cooldowns: [1, 1],
    help: {
        description: "Let me tell you what I'm all about!",
        usage: "s!info",
        examples: [
            ["s!info", "Views a summary about what Separoler does."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = InfoPlugin;
