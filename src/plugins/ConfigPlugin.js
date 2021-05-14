const { getSeparoleConfig } = require("../DatabaseWrapper");
const { PLUGIN_TYPES } = require("../helpers/constants");
const invalidCommand = require("../helpers/messages/invalidCommand");
const Plugin = require("../structs/Plugin");
const editConfig = require("./config/edit");
const viewConfig = require("./config/view");

async function handle(message, args) {
    const config = await getSeparoleConfig(message.guild.id);
    if (args.length === 0) {
        return viewConfig(message, config);
    }
    const firstArg = args[0].toLowerCase();
    if (["show", "view", "display"].includes(firstArg)) {
        return viewConfig(message, config);
    }
    if (firstArg === "edit") {
        args.shift();
        return editConfig(message, args, config);
    }
    return invalidCommand(message, "config");
}

const ConfigPlugin = new Plugin({
    name: "config",
    aliases: ["configuration", "settings"],
    type: PLUGIN_TYPES[0],
    cooldowns: [3, 1],
    help: {
        description: "View or edit the current Separoler policy settings for this server. Each policy specifies which Separoles to display on a user.",
        usage: "s!config [edit <policy> <setting>]",
        examples: [
            ["s!config", "Displays the current Separoler policy settings."],
            ["s!config edit top all", "If there are Separoles that have a higher position than all of the user's current roles, all of them should be added to the user."],
            ["s!config edit midgroup lowest", "If there are Separoles grouped together in-between other roles, only the lowest one should be shown."]
        ]
    },
    handle,
    noDMs: true
});

module.exports = ConfigPlugin;
