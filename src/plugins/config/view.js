const { SEPAROLER_CONFIG_OPTIONS, NUMBER_EMOJIS } = require("../../helpers/constants");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");

function viewConfig(message, config) {
    const fields = Object.entries(SEPAROLER_CONFIG_OPTIONS).map(([key, { FRIENDLY_NAME, DESCRIPTION, OPTIONS }], index) => {
        const k = key.toLowerCase();
        const configVal = config[k];
        const optionsStr = OPTIONS.map(option => `\`${option}\``).join(', ');
        const value = `__Current Setting__: \`${configVal}\`\n__Available Settings__: ${optionsStr}\n${DESCRIPTION}`;
        return {
            name: `${NUMBER_EMOJIS[index + 1]} ${FRIENDLY_NAME} <\`${k}\`>`,
            value
        }
    });
    return message.channel.send({
        embed: {
            title: "Viewing Separoler Configuration",
            description: `Here is the current configuration for **${message.guild.name}**. Each of these policies handle whether Separoles are kept or removed.`,
            fields,
            footer: {
                iconURL: getUserAvatarURL(message.author),
                text: `Enter "s!config edit <policy> <setting>" to change this server's Separoler configuration.`
            }
        }
    });
}

module.exports = viewConfig;
