const { addAndRemoveSeparoleDependants } = require("../../DatabaseWrapper");
const { success_green } = require("../../helpers/colors");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");
const isSeparoleManager = require("../../helpers/isSeparoleManager");
const logger = require("../../helpers/logger");
const errorOccured = require("../../helpers/messages/errorOccurred");
const invalidAction = require("../../helpers/messages/invalidAction");
const searchRoles = require("../../helpers/searchRoles");

const mentionRegex = /^(?:<@&?)?(\d+)>?$/;

async function addSeparoleGroup(message, args, separoleGroups) {
    if (!isSeparoleManager(message.member)) {
        return invalidAction(message, `You need Manage Server Permissions to add Separoles to **${message.guild.name}**.`)
    }
    if (args.length === 0) {
        return invalidAction(message, "Specify the separole to edit the group of, then specify role/s to add to the group.")
    }
    const roleManager = await message.guild.roles.fetch();
    if (!roleManager) {
        return invalidAction(message, "Sorry, this server does not have any roles!");
    }
    const separole = searchRoles(roleManager.cache.array(), parseArg(args.shift()));
    if (!separole) {
        return invalidAction(message, "Please provide a valid role name or id.");
    }
    const separoles = Object.keys(separoleGroups);
    if (!separoles.includes(separole.id)) {
        return invalidAction(message, "Please provide a valid separole name or id as the first argument.");
    }
    if (args.length === 0) {
        return invalidAction(message, "After specifying the separole to edit the group of, specify role/s to add to the group.")
    }
    const rolesToAdd = args
        .map(arg => searchRoles(roleManager.cache.array(), parseArg(arg)))
        .filter(role => role && role.id);
    if (rolesToAdd.length < args.length) {
        return invalidAction(message, "Please provide valid role names or ids as arguments, separated by a space.");
    }
    const roleToAddIsSeparole = rolesToAdd.find(role => separoles.includes(role.id));
    if (roleToAddIsSeparole) {
        return invalidAction(message, "A Separole cannot be part of another Separole's group.");
    }
    const allRolesWithGroups = Object.values(separoleGroups).reduce((arr, g) => arr.concat(g), []);
    const finalRolesToAdd = rolesToAdd.filter(role => !allRolesWithGroups.includes(role.id));
    if (finalRolesToAdd.length === 0) {
        return invalidAction(message, "The roles you have specified are already part of existing groups!")
    }
    try {
        await addAndRemoveSeparoleDependants(message.guild.id, separole.id, finalRolesToAdd.map(role => role.id), []);
    } catch (err) {
        logger.error({
            msg: "Error occurred when trying to add new role to separole group.",
            guild: message.guild.id,
            separole,
            currentList: separoleGroups[separole],
            rolesToAdd: finalRolesToAdd,
            err
        });
        return errorOccured(message, "Something went wrong while adding a new role to the separole group.");
    }
    const noOfRoles = finalRolesToAdd.length;
    const rolesStr = finalRolesToAdd.map((r, index) => {
        const mention = `<@&${r.id}>`;
        const amtToPad = `${noOfRoles}`.length;
        const num = `${index + 1}`.padStart(amtToPad);
        return `${num}. ${mention}`;
    }).join('\n');
    return message.channel.send({
        embeds: [{
            title: "Successfully added new roles to a Separole Group!",
            color: success_green,
            fields: [
                {
                    name: "Separole",
                    value: `<@&${separole.id}>`
                },
                {
                    name: "Roles added to Group",
                    value: rolesStr
                }
            ],
            footer: {
                text: `View the current list of Separole groups by entering \`s!grouos\`!`,
                icon_url: getUserAvatarURL(message.author)
            }
        }]
    });
}

function parseArg(arg) {
    const mentionRegexRes = mentionRegex.exec(arg);
    return mentionRegexRes
        ? mentionRegexRes[1]
        : arg;
}

module.exports = addSeparoleGroup;
