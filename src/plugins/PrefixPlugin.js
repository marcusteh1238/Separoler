const { setPrefix } = require("../DatabaseWrapper");
const { success_green } = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const getUserAvatarURL = require("../helpers/getUserAvatarURL");
const isSeparoleManager = require("../helpers/isSeparoleManager");
const invalidAction = require("../helpers/messages/invalidAction");
const Plugin = require("../structs/Plugin");

const BOT_PREFIX = process.env.PREFIX;

async function handle(message, args) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to change the custom prefix for Separoler in **${message.guild.name}**.`)
    }
    if (args.length === 0) {
        return invalidAction(message, "Please enter a custom prefix to set. Usage: `s!prefix <new prefix>`");
    }
    if (args.length !== 1) {
        return invalidAction(message, "Please enter a new prefix that does not include spaces.");
    }
    const newPrefix = args[0];
    if (newPrefix.length > 15) {
        return invalidAction(message, "Please enter a new prefix that has 15 characters or less.");
    }
    await setPrefix(message.guild.id, newPrefix);
    return message.channel.send({
        embed: {
            title: "Prefix Successfully Set!",
            description: `Separoler will now listen to commands on the prefix \`${newPrefix}\`, and on the default prefix \`${BOT_PREFIX}\``,
            color: success_green,
            footer: {
                icon_url: getUserAvatarURL(message.author),
                text: `Prefix has been set by ${message.author.username}.`
            }
        }
    });
}

const PrefixPlugin = new Plugin({
    name: "prefix",
    aliases: [],
    type: PLUGIN_TYPES[0],
    help: {
        description: "Set a custom prefix for Separoler commands in your server. The original prefix \"s!\" will still work.",
        usage: "s!prefix <new prefix>",
        examples: [
            ["s!prefix pp", "Changes the prefix to pp."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = PrefixPlugin;
