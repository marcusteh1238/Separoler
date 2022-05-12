const path = require("path");
const requireAll = require("require-all");

const { getBaseConfig } = require("../../DatabaseWrapper");
const HelpPlugin = require("../../structs/HelpPlugin");
const { error_red } = require("../../helpers/colors");
const logger = require("../../helpers/logger");

const { PREFIX, BOT_ID } = process.env;

const mainRegex = " *([a-z0-9]+)(?: ((?:\\s|\\S)+))?$";

const plugins = requireAll({
    dirname: path.resolve("src/plugins"),
    filter: /.+Plugin\.js$/
});

const helpPlugin = new HelpPlugin(plugins);
plugins.HelpPlugin = helpPlugin;

const onCooldown = new Map();

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

/**
 * 
 * @param {Discord.Message} message 
 */
async function CommandListener(message) {
    if (isSeparolerMention(message.content)) {
        helpPlugin.handle(message, []);
        return;
    }
    const { prefix } = await getBaseConfig(message.guild.id);
    const match = message.content.match(
        new RegExp(
            `^(?:(?:${escapedRegex(prefix)})|(?:${escapedRegex(PREFIX)}))${mainRegex}`,
            "i"
        )
    );
    if (!match || match.length < 2) {
        return;
    }

    const cmdWord = match[1].toLowerCase();
    const plugin = pluginActivators[cmdWord];
    // plugin does not exist.
    if (!plugin) {
        return;
    }
    // plugins that cannot work in DMs shouldn't be activated.
    if (plugin.noDMs && !message.guild.available) {
        return;
    }
    const args = match[2] ? match[2].trim().split(" ") : [];
    let pluginName = plugin.name;
    // TODO: handle cooldowns.
    try {
        // "s!command help"
        if (args[0] && args[0].toLowerCase() === "help") {
            pluginName = "help";
            const cooldownKey = getKey(message.author.id, pluginName);
            if (onCooldown.has(cooldownKey)) {
                await sendCooldownMessage(message, onCooldown.get(cooldownKey), plugins.help.cooldowns[0]);
            } else {
                putUserOnCooldown(message.author.id, pluginName, plugins.help.cooldowns[0]);
                await pluginActivators.help.handle(message, [cmdWord]);
            }
        } else {
            // check if hit cooldown. if hit cooldown, show cooldown message.
            const cooldownKey = getKey(message.author.id, pluginName);
            if (onCooldown.has(cooldownKey)) {
                await sendCooldownMessage(message, onCooldown.get(cooldownKey), plugin.cooldowns[0]);
            } else {
                putUserOnCooldown(message.author.id, pluginName, plugin.cooldowns[0]);
                await plugin.handle(message, args);
            }
        }
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

function sendCooldownMessage(message, cooldownStartTime, cooldownDurationSeconds) {
    const cooldownMs = cooldownDurationSeconds * 1000 - (Date.now() - cooldownStartTime);
    const cooldownSeconds = Math.ceil(cooldownMs / 1000)
    return message.channel.send({
        embeds: [{
            title: "Sorry, you're on cooldown.",
            description: `**<@!${message.author.id}>**, please try again in \`${cooldownSeconds}\` seconds!`,
            color: error_red
        }]
    });
}

function putUserOnCooldown(userId, commandName, cooldownSeconds) {
    const key = getKey(userId, commandName);

    onCooldown.set(key, Date.now());
    setTimeout(() => {
        onCooldown.delete(key);
    },  cooldownSeconds * 1000)
}

function getKey(userId, commandName) {
    return `${userId}_${commandName}`;
}

function escapedRegex(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function isSeparolerMention(content) {
    const regex = /^<@!{0,1}(\d+)>$/;
    const res = regex.exec(content);
    if (!res) return false;
    return res[1] === BOT_ID;
}

module.exports = CommandListener;
