const { getSeparoleList, getBaseConfig, getSeparoleConfig } = require("../DatabaseWrapper");
const { info_lavendar } = require("../helpers/colors");
const { PLUGIN_TYPES } = require("../helpers/constants");
const getUserAvatarURL = require("../helpers/getUserAvatarURL");
const Plugin = require("../structs/Plugin");

async function handle(message) {
    // need to know the following info
    // 1. prefix?
    // 2. am i enabled?
    // 3. can manage separole?
    const [separoleListObj, baseConfig, srConfig, roleManager] = await Promise.all([
        getSeparoleList(message.guild.id),
        getBaseConfig(message.guild.id),
        getSeparoleConfig(message.guild.id),
        message.guild.roles.fetch()
    ]);
    let fixHint = "";
    const separoles = separoleListObj.separoles.map((srId) => roleManager.cache.get(srId));
    const { prefix } = baseConfig;
    const selfHighestRole = message.guild.me.roles.highest;
    const hasManageRolePerms = message.guild.me.hasPermission("MANAGE_ROLES");
    if (!hasManageRolePerms) {
        fixHint = "Give Separoler Manage Roles Permissions!";
    }
    const isEnabled = srConfig.is_global_enabled;
    if (!fixHint && !isEnabled) {
        fixHint = "Enable Separoler with \"s!enable\"!";
    }
    const description = getDescription(prefix, isEnabled, hasManageRolePerms);
    separoles.sort((sr1, sr2) => sr2.position - sr1.position);
    const fields = separoles.map(sr => {
        const isRolePosHigher = selfHighestRole.comparePositionTo(sr) > 0
        if (!fixHint && !isRolePosHigher) {
            fixHint = `Set the highest role of Separoler to be higher than the Separole ${sr.name}`;
        }
        const canBeManaged = hasManageRolePerms && isRolePosHigher;
        const name = canBeManaged
            ? sr.name
            : `⚠️ ${sr.name}`;
        const value = canBeManaged
            ? "**__Can__** be managed by Separoler."
            : `⚠️ **__Cannot__** be managed by Separoler: ${getReason(hasManageRolePerms, isRolePosHigher)}`;
        return {
            name,
            value
        }
    });
    const footerText = fixHint
        ? `⚠️ ${fixHint}`
        : `✅ Separoler should be working fine and dandy!~`;
    return message.channel.send({
        embed: {
            title: "Viewing Debug Information",
            description,
            fields,
            color: info_lavendar,
            footer: {
                icon_url: getUserAvatarURL(message.author),
                text: footerText
            }
        }
    });

}

function getReason(hasManageRolePerms, isRolePosHigher) {
    if (!hasManageRolePerms) {
        return "Separoler does not have `MANAGE ROLES` Permissions.";
    }
    if (!isRolePosHigher) {
        return "The highest role that Separoler has has a lower position than this role.";
    }
    return "";
}

function getDescription(prefix, isEnabled, hasManageRolePerms) {
    const prefixStr = `**Prefix:** \`${prefix}\``;
    const enabledStr = `**Is Separoler Enabled:** ${isEnabled ? "Yes" : "No"}`;
    const canManageRoleStr = `**Can Separoler Manage Roles:** ${hasManageRolePerms ? "Yes" : "No"}`;
    return `${prefixStr}\n${enabledStr}\n${canManageRoleStr}\n\n**__Separole Information:__**`;
}

const DebugPlugin = new Plugin({
    name: "debug",
    aliases: [],
    type: PLUGIN_TYPES[0],
    cooldowns: [5, 1],
    help: {
        description: "View debug information about your Separoler setup.",
        usage: "s!debug",
        examples: [
            ["s!debug", "Views debug information."]
        ]
    },
    handle,
    noDMs: false
});

module.exports = DebugPlugin;
