const path = require("path");
const Discord = require("discord.js");
const requireAll = require("require-all");

const logger = require("./helpers/logger");

const client = new Discord.Client();

const allListeners = requireAll({
    dirname: path.resolve("src/listeners"),
    filter: /.+Listener\.js$/
});

client.once("ready", () => {
    logger.info({
        msg: "Separoler is now ready to receive Discord Events."
    })
});

Object.entries(allListeners)
    .forEach(([eventName, eventListeners]) => {
        Object.values(eventListeners)
            .forEach(listener => client.on(eventName, listener));
});

client.login(process.env.BOT_TOKEN);

module.exports = client;
