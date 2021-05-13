const Fuse = require("fuse.js");
const { addAndRemoveSeparoles } = require("../../DatabaseWrapper");
const { success_green } = require("../../helpers/colors");
const { MAX_SEPAROLES } = require("../../helpers/constants");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");
const isSeparoleManager = require("../../helpers/isSeparoleManager");
const logger = require("../../helpers/logger");
const errorOccured = require("../../helpers/messages/errorOccurred");
const invalidAction = require("../../helpers/messages/invalidAction");

async function addSeparole(message, args, separoles) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to add Separoles to **${message.guild.name}**.`)
    }
    const maxSeparoles = MAX_SEPAROLES.DEFAULT;
    if (separoles.length >= maxSeparoles) {
        return invalidAction(message, `You already have the maximum number of **${maxSeparoles}** Separoles. Remove a pre-existing Separole before adding a new one!`)
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
    const role = searchRoles(roleManager.cache.array(), queryStr);
    if (!role) {
        return invalidAction(message, "Please provide a valid role name or id.")
    }
    const separoleIds = separoles.map(({ id }) => id);
    if (separoleIds.includes(role.id)) {
        return invalidAction(message, `The role <@&${role.id}> is already a Separole!`);
    }
    if (roleManager.everyone.id === role.id) {
        return invalidAction(message, `The \`@everyone\` role cannot be a Separole.`);
    }
    // is valid role, add to DB.
    try {
        await addAndRemoveSeparoles(message.guild.id, [role.id], []);
    } catch (err) {
        logger.error({
            msg: "Error occurred when trying to add new separole.",
            guild: message.guild.id,
            oldList: separoleIds,
            roleToAdd: role.id
        });
        return errorOccured(message, "Something went wrong while adding a new separole.");
    }
    return message.channel.send({
        embed: {
            title: "Successfully added new Separole!",
            description: `The role <@&${role.id}> has been successfully set as a Separole.`,
            color: success_green,
            footer: {
                text: `View the current list of Separoles by entering \`s!separoles\`!`,
                icon_url: getUserAvatarURL(message.author)
            },
        }
    });
    
}

function searchRoles(roles, queryString) {
    const fromId = roles.find(role => role.id === queryString);
    if (fromId) {
        return fromId;
    }
    const fuse = new Fuse(roles, { keys: ["name"], limit: 1 });
    const [result] = fuse.search(queryString);
    if (!result) return result;
    return roles[result.refIndex];
}

module.exports = addSeparole
