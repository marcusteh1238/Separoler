const getCurrentSeparoles = require("../helpers/getCurrentSeparoles");
const Plugin = require("../structs/Plugin");
const viewSeparoles = require("./separole/view");
const addSeparoles = require("./separole/add");
const removeSeparoles = require("./separole/remove");
const invalidCommand = require("../helpers/messages/invalidCommand");

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
    if (["remove"].includes(firstArg)) {
        return removeSeparoles(message, args.slice(1), separoles)
    }
    return invalidCommand(message, "separoles");
}

const SeparolePlugin = new Plugin({
    name: "separoles",
    aliases: ["sr", "separole", "separoler"],
    handle,
    noDMs: true
});

module.exports = SeparolePlugin;
