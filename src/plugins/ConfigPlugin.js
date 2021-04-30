const { getSeparoleConfig } = require("../DatabaseWrapper");
const invalidCommand = require("../helpers/messages/invalidCommand");
const Plugin = require("../structs/Plugin");
// const editConfig = require("./config/edit");
const viewConfig = require("./config/view");

async function handle(message, args) {
    const config = await getSeparoleConfig(message.guild.id);
    if (args.length === 0 || ["show", "view", "display"].includes(args[0])) {
        return viewConfig(message, config.separole);
    }
    // if (args[0] === "edit") {
    //     return editConfig(message, args, config.separole);
    // }
    return invalidCommand(message, "config");
}

const ConfigPlugin = new Plugin({
    name: "config",
    aliases: ["configuration", "settings"],
    handle,
    noDMs: true
});

module.exports = ConfigPlugin;
