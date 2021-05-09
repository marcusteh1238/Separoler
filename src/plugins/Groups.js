// s!group add <separole_id> <role id>
// s!group remove <separole_id> <role id>

const { PLUGIN_TYPES } = require("../helpers/constants");
const Plugin = require("../structs/Plugin");

// s!group remove <separole_id> all
// TODO: When adding role as a separole, check if that role is in a separole group. If so, throw an error.
// TODO: When adding a role into a separole group, check if that role is an existing separole. If so, throw an error.
async function handle(message, args) {
    
}

const GroupPlugin = new Plugin({
    name: "group",
    aliases: ["groups", "grp"],
    type: PLUGIN_TYPES[0],
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
