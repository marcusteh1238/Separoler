const { setSeparoleConfig } = require("../../DatabaseWrapper");
const { SEPAROLER_CONFIG_OPTIONS } = require("../../helpers/constants");
const logger = require("../../helpers/logger");
const invalidAction = require("../../helpers/messages/invalidAction");

const policyKeys = Object.keys(SEPAROLER_CONFIG_OPTIONS).map(key => key.toLowerCase());

async function editConfig(message, args, config) {
    if (!args[0]) {
        return invalidAction(message, "Please specify a policy and an option to change this server's Separoler configuration. You can view the full list of Configuration policies at `s!config`.");
    }
    const firstArg = args[0].toLowerCase();
    const policyKeysStr = policyKeys.map(str => `\`${str}\``).join(', ')
    if (!policyKeys.includes(firstArg)) {
        return invalidAction(message, `Invalid policy specified. The list of policies are: ${policyKeysStr}`);
    }
    const policyKey = firstArg.toUpperCase();
    // correct policy key specified.
    const policy = SEPAROLER_CONFIG_OPTIONS[policyKey];
    const policyOptions = policy.OPTIONS;
    const policyOptionsStr = policyOptions.map(str => `\`${str}\``).join(', ')
    if (!args[1]) {
        return invalidAction(message, `Please specify an option to change this server's Separoler configuration for the policy \`${firstArg}\`. The options for this policy are: ${policyOptionsStr}`);
    }
    
    const secondArg = args[1].toLowerCase();
    if (!policyOptions.includes(secondArg)) {
        return invalidAction(message, `Invalid policy option specified for the policy \`${secondArg}\`. The options for this policy are: ${policyOptionsStr}`);
    }
    // if policy has changed.
    if (config.separole[firstArg] !== secondArg) {
        const newConfig = JSON.parse(JSON.stringify(config));
        newConfig.separole[firstArg] = secondArg;
        try {
            await setSeparoleConfig(message.guild.id, newConfig);
        } catch (err) {
            logger.error({
                msg: "Error occurred trying to set Separole config.",
                server: message.server.id,
                config: newConfig
            });
            return message.channel.send({
                embed: {
                    title: "Error Occurred!",
                    description: "Sorry, an error occurred while trying to change this server's Separoler configuration."
                }
            });
        }
    }

    const fields = [
        {
            name: policy.FRIENDLY_NAME,
            value: policy.DESCRIPTION
        },
        {
            name: "Setting Changed",
            value: `\`${config.separole[firstArg]}\` => \`${secondArg}\``
        }
    ]

    return message.channel.send({
        embed: {
            title: "Configuration Changed Successfully!",
            fields,
            color: 32768
        }
    })

}

module.exports = editConfig;
