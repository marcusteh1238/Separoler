const { SEPAROLER_CONFIG_OPTIONS, NUMBER_EMOJIS } = require("../../helpers/constants");

function viewConfig(message, config) {
    const fields = Object.entries(SEPAROLER_CONFIG_OPTIONS).map(([key, { FRIENDLY_NAME, DESCRIPTION }], index) => {
        const k = key.toLowerCase();
        const configVal = config[k];
        const value = `__Current Setting__: \`${configVal}\`\n${DESCRIPTION}`;
        return {
            name: `${NUMBER_EMOJIS[index + 1]} ${FRIENDLY_NAME}`,
            value
        }
    });
    return message.channel.send({
        embed: {
            title: "Viewing Separoler Configuration",
            description: `Here is the current configuration for **${message.guild.name}**. Each of these policies handle whether Separoles are kept or removed.`,
            fields,
            footer: {
                iconURL: message.author.avatarURL({ dynamic: true, size: 128 }),
                text: `Enter "s!config edit" to edit this server's Separoler configuration.`
            }
        }
    });
}

module.exports = viewConfig;
