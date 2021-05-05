const { info_lavendar } = require("../../helpers/colors");
const { SEPAROLER_CONFIG_OPTIONS, NUMBER_EMOJIS } = require("../../helpers/constants");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");

function viewConfig(message, config) {
    const isRemMidGroup = config.mid === "remove";
    const fields = Object.entries(SEPAROLER_CONFIG_OPTIONS)
        .filter(([key]) => !isRemMidGroup || key !== "MIDGROUP")
        .map(([key, { FRIENDLY_NAME, DESCRIPTION, OPTIONS }], index) => {
        const k = key.toLowerCase();
        const configVal = config[k];
        const optionsStr = OPTIONS.map(option => `\`${option}\``).join(', ');
        const value = `__Current Setting__: \`${configVal}\`\n__Available Settings__: ${optionsStr}\n${DESCRIPTION}`;
        return {
            name: `${NUMBER_EMOJIS[index + 1]} ${FRIENDLY_NAME} <\`${k}\`>`,
            value
        }
        });
    const isEnabledStr = config.is_global_enabled ? "enabled" : "disabled";
    let description = `Separoles are currently **${isEnabledStr}.**\n\nHere is the current configuration for **${message.guild.name}**. Each of these policies handle whether Separoles are kept or removed.`;
    if (isRemMidGroup) {
        description = `${description}\n\n⚠️**NOTE:** Grouped Middle Separole policy is currently __disabled__ as all middle Separoles are already removed due to the Middle Separole policy.`
    }
    return message.channel.send({
        embed: {
            title: "Viewing Separoler Configuration",
            description,
            fields,
            color: info_lavendar,
            footer: {
                iconURL: getUserAvatarURL(message.author),
                text: `Enter "s!config edit <policy> <setting>" to change this server's Separoler configuration.`
            }
        }
    });
}

module.exports = viewConfig;
