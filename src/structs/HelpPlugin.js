const { info_lavendar } = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const Plugin = require("./Plugin");

class HelpPlugin extends Plugin {
    
    constructor(pluginsObj) {
        const helpPluginObject = {
            name: "help",
            aliases: ["h"],
            cooldowns: [5, 5],
            noDMs: false,
            type: PLUGIN_TYPES[1],
            help: {
                description: "Displays the help menu for Separole commands.",
                examples: [
                    ["s!help", "Displays the main help menu containing all Separoles commands."],
                    ["s!help config", "View help on how to use the `s!config` command."]
                ],
                usage: "s!help [command]"
            }
        }
        const pluginsArr = Object.values(pluginsObj);
        const handle = getHandler(pluginsArr.concat(helpPluginObject));
        helpPluginObject.handle = handle;
        super(helpPluginObject);
    }
}

/**
 * Builds the help command.
 * @param {Plugin[]} plugins The array of plugins. 
 */
function getHandler(plugins) {
    const nameAndAliasesToPlugin = plugins.reduce((obj, plugin) => {
        const nameAndAliasesMap = [plugin.name, ...plugin.aliases]
        // eslint-disable-next-line no-param-reassign
        nameAndAliasesMap.forEach(a => { obj[a] = plugin })
        return obj;
    }, {})
    
    /**
     * @param {Message} message 
     * @param {string[]} args 
     */
    async function handle(message, args) {
        if (args.length === 1 && Object.prototype.hasOwnProperty.call(nameAndAliasesToPlugin, args[0].toLowerCase())) {
            const plugin = nameAndAliasesToPlugin[args[0].toLowerCase()];
            return viewParticularHelpMenu(message, plugin);
        }
        return viewHelpMainMenu(message, plugins);
    }
    return handle;
}

function viewParticularHelpMenu(message, plugin) {
    const { description, examples, usage } = plugin.help;
    const exampleStr = examples
        .map(([eg, desc]) => `\`${eg}\`\n${desc}`)
        .join("\n\n");
    const aliasStr = plugin.aliases.map(alias => `\`${alias}\``).join(", ") || "None";
    return message.channel.send({
        embed: {
            title: `s!${plugin.name}`,
            description: `**Aliases:** ${aliasStr}\n\`\`\`${description}\`\`\``,
            color: info_lavendar,
            fields: [
                {
                    name: "Usage",
                    value: `\`${usage}\``
                },
                {
                    name: "Examples",
                    value: exampleStr
                }
            ]
        }
    });
}

function viewHelpMainMenu(message, plugins) {
    const title = "Separoler Help Menu";
    const description = "Type `s!help [command]` for more help eg. `s!help invite`."
    const fields = PLUGIN_TYPES
        .map(type => {
            const strings = plugins
                .filter(plugin => plugin.type === type)
                .map(({ name }) => `\`${name}\``);
            plugins.sort();
            const value = strings.join(' ');
            return {
                name: type,
                value
            };
        });
    return message.channel.send({
        embed: {
            title,
            description,
            fields,
            color: info_lavendar
        }
    })
}

module.exports = HelpPlugin;
