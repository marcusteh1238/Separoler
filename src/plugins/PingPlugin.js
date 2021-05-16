
const { PLUGIN_TYPES } = require("../helpers/constants");
const Plugin = require("../structs/Plugin");

async function handle(message) {
    const initialMessage = await message.channel.send({
        content: "🏓 Pong!"
    });
    const time = initialMessage.createdTimestamp;
    return initialMessage.edit({
        content: `🏓 Pong! | Time Taken: \`${Date.now() - time}\`ms`
    });
}

const PingPlugin = new Plugin({
    name: "ping",
    aliases: ["pingerino"],
    type: PLUGIN_TYPES[1],
    cooldowns: [1, 1],
    help: {
        description: "Pong! Measure the latency between Discord and Separoler.",
        usage: "s!ping",
        examples: [
            ["s!ping", "Pong."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = PingPlugin;
