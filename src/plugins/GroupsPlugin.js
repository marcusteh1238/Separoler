// s!group add <separole_id> <role id>
// s!group remove <separole_id> <role id>

const { getAllSeparoleGroups } = require("../DatabaseWrapper");
const { info_lavendar } = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const getUserAvatarURL = require("../helpers/getUserAvatarURL");
const invalidCommand = require("../helpers/messages/invalidCommand");
const Plugin = require("../structs/Plugin");
const addSeparoleGroup = require("./groups/add");
const removeSeparoleGroup = require("./groups/remove");

// s!group remove <separole_id> all
// TODO: When adding role as a separole, check if that role is in a separole group. If so, throw an error.
// TODO: When adding a role into a separole group, check if that role is an existing separole. If so, throw an error.
async function handle(message, args) {
    const separoleGroups = await getAllSeparoleGroups(message.guild.id);
    if (args.length === 0) {
        return viewSeparoleGroups(message, separoleGroups)
    }
    const firstArg = args.shift().toLowerCase();
    if (firstArg === "add") {
        return addSeparoleGroup(message, args, separoleGroups);
    }
    if (["remove", "rm"].includes(firstArg)) {
        return removeSeparoleGroup(message, args, separoleGroups);
    }
    return invalidCommand(message, "group");
}

async function viewSeparoleGroups(message, separoleGroups) {
    const entries = Object.entries(separoleGroups);
    const fields = await Promise.all(entries
        .map(async ([sr, grp]) => {
            const grpStr = grp.length === 0
                ? "No Group"
                : grp.map(str => `<@&${str}>`).join("\n");
            const separole = await message.guild.roles.fetch(sr)
            return {
                name: separole.name,
                value: grpStr,
                inline: true
            }
        }));
    return message.channel.send({
        embeds: [{
            title: "Viewing Separole Groups",
            description: "Here is a list of your Separoles and their groups. If the Separole has a group, the Separole will only be added to a user if they have equipped any role in the Separole's group.",
            color: info_lavendar,
            fields,
            footer: {
                text: `Enter "s!groups add <separole> <role>" to add a role to the group of a separole.`,
                icon_url: getUserAvatarURL(message.author)
            }
        }]
    });
}

const GroupPlugin = new Plugin({
    name: "group",
    aliases: ["groups", "grp"],
    type: PLUGIN_TYPES[0],
    cooldowns: [3, 1],
    help: {
        description: "Add roles to a Separole group, so that Separole only shows up when the user has those roles. By default, if there are no roles in a Separole's group, all roles below it belong to that Separole's group.",
        usage: "s!groups [add <separole> [role2] [role3]... | remove <separole> [role2] [role3]...]",
        examples: [
            ["s!groups", "Views a summary of all your current Separole groups."],
            ["s!groups add Fruits Apple", "Add the role Apple to the Fruits separole group."],
            ["s!groups add Fruits Apple Banana Pear", "Add the roles Apple, Banana, and Pear to the Fruits separole group."],
            ["s!groups remove Fruits Apple", "Remove the role Apple from the Fruits separole group."],
            ["s!groups remove Fruits Apple Banana Pear", "Removes the roles Apple, Banana, and Pear from the Fruits separole group."],
        ]
    },
    handle,
    noDMs: false
});

module.exports = GroupPlugin;
