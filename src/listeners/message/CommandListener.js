const path = require("path");
const requireAll = require("require-all");
const logger = require("../../helpers/logger");

const prefix = process.env.PREFIX;
const mainRegex = " *([a-z0-9]+)(?: ((?:\\s|\\S)+))?$";

const plugins = requireAll({
    dirname: path.resolve("src/plugins"),
    filter: /.+Plugin\.js$/
});

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

async function CommandListener(message) {
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
    // plugin does not exist.
    if (!plugin) {
        return;
    }
    // plugins that cannot work in DMs shouldn't be activated.
    if (plugin.noDMs && !plugin.guild.available) {
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

module.exports = CommandListener;
