const { setSeparolerEnabled } = require("../../DatabaseWrapper");
const { success_green } = require("../../helpers/colors");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");
const isSeparoleManager = require("../../helpers/isSeparoleManager");
const logger = require("../../helpers/logger");
const errorOccured = require("../../helpers/messages/errorOccurred");
const invalidAction = require("../../helpers/messages/invalidAction");

async function disableSeparoler(message) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to disable Separoles in **${message.guild.name}**.`)
    }
    try {
        await setSeparolerEnabled(message.guild.id, false);
    } catch (err) {
        logger.error({
            msg: "Error occurred while trying to disable Separoler.",
            err
        });
        return errorOccured(message, "Sorry, an error occurred while trying to disable Separoler.");
    }
    return message.channel.send({
        embeds: [{
            title: "Successfully disabled Separole Management!",
            description: `The automatic addition and removal of Separoles is now disabled.`,
            color: success_green,
            footer: {
                text: `Enable it again by entering "s!sr enable"!`,
                icon_url: getUserAvatarURL(message.author)
            },
        }]
    });
}

module.exports = disableSeparoler;
