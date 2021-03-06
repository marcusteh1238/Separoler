const getCurrentSeparoles = require("../helpers/getCurrentSeparoles");
const Plugin = require("../structs/Plugin");
const viewSeparoles = require("./separole/view");
const addSeparoles = require("./separole/add");
const enableSeparoles = require("./separole/enable");
const disableSeparoles = require("./separole/disable");
const removeSeparoles = require("./separole/remove");
const invalidCommand = require("../helpers/messages/invalidCommand");
const { PLUGIN_TYPES } = require("../helpers/constants");

async function handle(message, args) {
    const separoles = await getCurrentSeparoles(message.guild);
    if (args.length === 0) {
        return viewSeparoles(message, separoles)
    }
    const firstArg = args[0].toLowerCase();

    if (["show", "view", "display"].includes(firstArg)) {
        return viewSeparoles(message, separoles)
    }
    if (["add"].includes(firstArg)) {
        return addSeparoles(message, args.slice(1), separoles)
    }
    if (["enable"].includes(firstArg)) {
        return enableSeparoles(message, args.slice(1), separoles)
    }
    if (["disable"].includes(firstArg)) {
        return disableSeparoles(message, args.slice(1), separoles)
    }
    if (["remove", "rm"].includes(firstArg)) {
        return removeSeparoles(message, args.slice(1), separoles)
    }
    return invalidCommand(message, "separoles");
}

const SeparolePlugin = new Plugin({
    name: "separoles",
    aliases: ["sr", "separole", "separoler", "eparole"],
    handle,
    type: PLUGIN_TYPES[0],
    cooldowns: [3, 1],
    help: {
        description: "View the current list of Separoles, or edit the list of Separoles.",
        usage: "s!separoles [add <role> | remove <role>]",
        examples: [
            ["s!separoles", "Displays the list of Separoles in the current server."],
            ["s!separoles add Awesome", `Adds the "Awesome" role to the list of Separoles.`],
            ["s!separoles remove @MentionableRole", `Removes the @MentionableRole role from the list of Separoles.`]
        ]
    },
    noDMs: true
});

module.exports = SeparolePlugin;
