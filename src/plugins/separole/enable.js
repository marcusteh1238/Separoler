const { setSeparolerEnabled } = require("../../DatabaseWrapper");
const { success_green } = require("../../helpers/colors");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");
const isSeparoleManager = require("../../helpers/isSeparoleManager");
const logger = require("../../helpers/logger");
const errorOccured = require("../../helpers/messages/errorOccurred");
const invalidAction = require("../../helpers/messages/invalidAction");

async function enableSeparoler(message) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to enable Separoles in **${message.guild.name}**.`)
    }
    try {
        await setSeparolerEnabled(message.guild.id, true);
    } catch (err) {
        logger.error({
            msg: "Error occurred while trying to enable Separoler.",
            err
        });
        return errorOccured(message, "Sorry, an error occurred while trying to enable Separoler.");
    }
    return message.channel.send({
        embeds: [{
            title: "Successfully enabled Separole Management!",
            description: `The automatic addition and removal of Separoles is now enabled.`,
            color: success_green,
            footer: {
                text: `View the current list of Separoles by entering \`s!separoles\`!`,
                icon_url: getUserAvatarURL(message.author)
            },
        }]
    });
}

module.exports = enableSeparoler;
