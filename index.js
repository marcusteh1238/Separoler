require("dotenv-safe").config();
const path = require("path");
const requireAll = require("require-all");
const Discord = require("discord.js");

const logger = require("./src/helpers/logger");

const plugins = requireAll({
    dirname: path.resolve("src/plugins"),
    filter: /.+Plugin\.js$/
});
const mainRegex = " *([a-z0-9]+)(?: ((?:\\s|\\S)+))?$";

const pluginActivators = Object.values(plugins).reduce((allActivators, plugin) => {
    const words = [plugin.name].concat(plugin.aliases);
    words.forEach((word) => {
        if (allActivators[word]) {
            if (!Array.isArray(allActivators[word])) {
                // eslint-disable-next-line no-param-reassign
                allActivators[word] = [allActivators[word]]
            }
            allActivators[word].push(plugin);
        } else {
            // eslint-disable-next-line no-param-reassign
            allActivators[word] = plugin;
        }
    });
    return allActivators;
}, {});

const prefix = process.env.PREFIX;
const client = new Discord.Client();

client.once("ready", () => {
    logger.info({
        msg: "Separoler is now ready to receive Discord Events."
    })
})

client.on("message", async (message) => {
    // handle potential command.
    await pluginHandler(message);
});

async function pluginHandler(message) {
    const match = message.content.match(
        new RegExp(
            `^(?:${escapedRegex(prefix)})${mainRegex}`,
            "i"
        )
    );
    if (!match || match.length < 2) {
        return;
    }

    const cmdWord = match[1].toLowerCase();
    const plugin = pluginActivators[cmdWord];
    if (!plugin) {
        return;
    }
    const args = match[2] ? match[2].trim().split(" ") : [];
    // TODO: handle cooldowns.
    try {
        await plugin.handle(message, args);
    } catch (err) {
        logger.error({
            msg: `Error occurred in plugin: ${plugin.name}`,
            plugin: plugin.name,
            args,
            err,
            message
        });
    }
}

function escapedRegex(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

client.login(process.env.BOT_TOKEN);
