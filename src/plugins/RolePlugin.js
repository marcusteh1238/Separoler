const { getAllSeparoleGroups } = require("../DatabaseWrapper");
const { info_lavendar } = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const getUserAvatarURL = require("../helpers/getUserAvatarURL");
const searchRoles = require("../helpers/searchRoles");
const invalidAction = require("../helpers/messages/invalidAction");
const Plugin = require("../structs/Plugin");

async function handle(message, args) {
    if (args.length === 0) {
        return invalidAction(message, "Enter a role name or id to view information about the role.");
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
    // get info to display
    // id, name, color, hoisted, position, mentionable
    // is separole, is part of separole group, Managable by Separoler
    const separoleGroups = await getAllSeparoleGroups(message.guild.id);
    const entries = Object.entries(separoleGroups);
    const isSeparole = entries.some(([separole]) => separole === role.id);
    const isPartOfSeparoleGrp = isSeparole
        ? undefined
        : entries.find(([, group]) => group.includes(role.id));
    const managableBySeparoler = message.guild.me.roles.highest.comparePositionTo(role) > 0;
    const colorStr = role.color === 0
        ? "Default"
        : role.hexColor;
    const fields = [
        {
            name: "Role",
            value: role.name,
            inline: true
        },
        {
            name: "Role ID",
            value: role.id,
            inline: true
        },
        {
            name: "Color",
            value: colorStr,
            inline: true
        },
        {
            name: "Position",
            value: role.position,
            inline: true
        },
        {
            name: "Is Separole",
            value: isSeparole ? "Yes" : "No",
            inline: true
        },
        {
            name: "Separole Group",
            value: isPartOfSeparoleGrp ? `<@&${isPartOfSeparoleGrp[0]}>` : "None",
            inline: true
        },
        {
            name: "Managable by Separoler",
            value: managableBySeparoler ? "Yes" : "No",
            inline: true
        }
    ];
    return message.channel.send({
        embed: {
            title: "Viewing Role Information",
            fields,
            color: role.color === 0 ? info_lavendar : role.color,
            footer: {
                icon_url: getUserAvatarURL(message.author),
                text: `Created: ${role.createdAt}`
            }
        }
    });
}

const RolePlugin = new Plugin({
    name: "role",
    aliases: [],
    type: PLUGIN_TYPES[1],
    help: {
        description: "View information about a role. This includes Separoler-specific information like whether it's a Separole or in a Separole group.",
        usage: "s!role <role>",
        examples: [
            ["s!role Fabulous", "Views information about the \"Fabulous\" role."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = RolePlugin;
