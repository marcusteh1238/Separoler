const { addAndRemoveSeparoles } = require("../../DatabaseWrapper");
const { success_green } = require("../../helpers/colors");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");
const isSeparoleManager = require("../../helpers/isSeparoleManager");
const logger = require("../../helpers/logger");
const errorOccured = require("../../helpers/messages/errorOccurred");
const invalidAction = require("../../helpers/messages/invalidAction");
const searchRoles = require("../../helpers/searchRoles");

async function removeSeparole(message, args, separoles) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to remove Separoles from **${message.guild.name}**.`)
    }
    let queryStr = args.join(' ');
    // extract snowflake from mention.
    const mentionRegex = /^(?:<@&?)?(\d+)>?$/;
    const mentionRegexRes = mentionRegex.exec(queryStr);
    if (mentionRegexRes) {
        [, queryStr] = mentionRegexRes;
    }
    // check guild if role exists.
    const roleManager = await message.guild.roles.fetch();
    if (!roleManager) {
        return invalidAction(message, "Sorry, this server does not have any roles!");
    }
    const role = searchRoles(roleManager.cache, queryStr);
    if (!role) {
        return invalidAction(message, "Please provide a valid role name or id.")
    }
    const separoleIds = separoles.map(({ id }) => id);
    if (!separoleIds.includes(role.id)) {
        return invalidAction(message, `The role <@&${role.id}> is not a Separole!`);
    }
    // is valid role, remove from DB.
    try {
        await addAndRemoveSeparoles(message.guild.id, [], [role.id])
    } catch (err) {
        logger.error({
            msg: "Error occurred when trying to remove separole.",
            guild: message.guild.id,
            oldList: separoleIds,
            separoleToRemove: role.id,
            err
        });
        return errorOccured(message, "Something went wrong while removing a separole.");
    }
    return message.channel.send({
        embeds: [{
            title: "Successfully removed Separole!",
            description: `The role <@&${role.id}> is now not a separole. To remove this role from existing users, you will need to delete it and re-add it again.`,
            color: success_green,
            footer: {
                text: `View the current list of Separoles by entering \`s!separoles\`!`,
                icon_url: getUserAvatarURL(message.author)
            },
        }]
    });
    
}

module.exports = removeSeparole
