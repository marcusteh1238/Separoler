const path = require("path");
const Discord = require("discord.js");
const requireAll = require("require-all");

const logger = require("./helpers/logger");

const client = new Discord.Client({
    intents:[
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

const allListeners = requireAll({
    dirname: path.resolve("src/listeners"),
    filter: /.+Listener\.js$/
});

client.once("ready", () => {
    logger.info({
        msg: "Separoler is now ready to receive Discord Events."
    });
    client.user.setActivity("s!help", {
        type: "PLAYING"
    });
});

Object.entries(allListeners)
    .forEach(([eventName, eventListeners]) => {
        Object.values(eventListeners)
            .forEach(listener => client.addListener(eventName, listener));
});



module.exports = client;
