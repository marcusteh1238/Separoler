// eslint-disable-next-line no-unused-vars
const {Guild, GuildMember} = require("discord.js");
const { getSeparoleConfig, getAllSeparoleGroups } = require("./DatabaseWrapper");
const getCurrentSeparoles = require("./helpers/getCurrentSeparoles");
const logger = require("./helpers/logger");

const policiesAndFuncs = {
    all: roles => roles,
    keep: roles => roles,
    none: () => [],
    remove: () => [],
    lowest: roles => roles.length > 0 ? [roles[roles.length - 1]] : [],
    highest: roles => roles.length > 0 ? [roles[0]] : []
}
const validPolicies = Object.keys(policiesAndFuncs);

/**
 * Checks and updates Separoles for a guild member.
 * @param {Guild} guild The guild.
 * @param {GuildMember} member The guild member.
 * @param {object} options 
 * @param {object} options.config config for the server, if already obtained.
 * @param {string[]} options.separoleStrArr array of separoles, if already obtained.
 */
async function SeparoleHandler(guild, member, { separoleStrArr, config } = {}) {
    if (!guild.me.hasPermission("MANAGE_ROLES")) {
        return;
    }
    const [separoles, serverConfig, srGroups, serverRoleManager] = await Promise.all([
        getCurrentSeparoles(guild, separoleStrArr),
        getConfig(guild.id, config),
        getAllSeparoleGroups(guild.id),
        guild.roles.fetch()
    ]);
    if (!serverConfig.is_global_enabled) {
        return;
    }
    const userRoles = member.roles.cache.array()
        .filter(role => role.id !== serverRoleManager.everyone.id); // everyone role not displayed.
    // assume all separoles equipped on user.
    const userWithoutSeparoles = userRoles
        .filter(ur => !separoles.some(sr => sr.id === ur.id))
    const currEquippedSeparoles = userRoles
        .filter(ur => separoles.some(sr => sr.id === ur.id))
    
    // const userWithAllSeparoles = userWithoutSeparoles
    //     .map(({ id, position }) => ({ id, position, isSeparole: false }))
    //     .concat(separoles.map(({ id, position }) => ({ id, position, isSeparole: true })));

    // remove separoles if it has a group, and if the user does not have any equipped roles from that group.
    const separolesThatHaveGroups = separoles
        .filter(separole => {
            const group = srGroups[separole.id];
            // Default behavior: Everything below is part of the group.
            if (group.length === 0) {
                return true;
            }
            return group.some(roleId => userWithoutSeparoles.some(role => role.id === roleId));
        })
        .map(({ id, position }) => ({ id, position, isSeparole: true }));
    const userWithAllSeparoles = userWithoutSeparoles
        .map(({ id, position }) => ({ id, position, isSeparole: false }))
        .concat(separolesThatHaveGroups);

    userWithAllSeparoles.sort((role1, role2) => role2.position - role1.position);
    // separate into groups.
    const separated = getSeparated(userWithAllSeparoles);
    // apply policy based on server config to get roles that are supposed to be equipped.
    const newBottom = performPolicyOnRoles(separated.bottom, serverConfig.bottom);
    const newTop = performPolicyOnRoles(separated.top, serverConfig.top);
    const newMid = performPolicyOnRoles(separated.mid, serverConfig.mid)
        .map(arr => performPolicyOnRoles(arr, serverConfig.midgroup))
        .flat();

    // get roles to add and remove.
    const newEquippedSeparoles = newTop
        .concat(newMid)
        .concat(newBottom);
    const promises = [];
    const botHighestRolePos = guild.me.roles.highest.position;
    const rolesToAdd = newEquippedSeparoles
        .filter(({ id, position }) =>  botHighestRolePos > position && !currEquippedSeparoles.some(role => role.id === id))
        .map(({ id }) => id);
    if (rolesToAdd.length > 0) {
        promises.push(member.roles.add(rolesToAdd));
    }
    
    const rolesToRemove = currEquippedSeparoles
        .filter(({ id, position }) => botHighestRolePos > position && !newEquippedSeparoles.some(role => role.id === id))
        .map(({ id }) => id);
    if (rolesToRemove.length > 0) {
        promises.push(member.roles.remove(rolesToRemove));
    }

    if (promises.length === 0) return;

    try {
        await Promise.all(promises);
        logger.debug(getDebugObj("Updating separoles", guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove));
    } catch (err) {
        logger.error(getDebugObj("Error occurred when updating separoles", guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove, err));
    }
}

function getDebugObj(msg, guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove, err) {
    return {
        msg,
        guild: {
            id: guild.id,
            name: guild.name
        },
        user: {
            id: member.id,
            username: member.user.username,
            discriminator: member.user.discriminator
        },
        guildSeparoles: separoles.map(({ id, name }) => ({ id, name })),
        prevSeparoles: currEquippedSeparoles.map(({ id, name }) => ({ id, name })),
        newSeparoles: newEquippedSeparoles.map(({ id, name }) => ({ id, name })),
        rolesToAdd,
        rolesToRemove,
        err
    }
}

/**
 * 
 * @param {{id: string, position: number, isSeparole: boolean}[]} roles 
 * @param {"all" | "none" | "lowest" | "highest" | "keep" | "remove"} option 
 * @return {{id: string, position: number, isSeparole: boolean}[]}
 */
function performPolicyOnRoles(roles, option) {
    const policy = policiesAndFuncs[option];
    if (!policy) {
        logger.error({
            msg: "Invalid policy option passed.",
            roles,
            option,
            validPolicies
        });
        throw Error("Invalid policy option passed in.");
    }
    return policy(roles);
}

function getSeparated(rolesList) {
    const allGroups = arraySplit(rolesList, role => !role.isSeparole);
    const top = allGroups.shift() || [];
    const bottom = allGroups.pop() || [];
    return {
        top,
        mid: allGroups,
        bottom,
    }
}

function arraySplit(array, predicate) {
    let tmp = [];
    const lastIndex = array.length - 1;
    return array.reduce((newArr, element, index) => {
        if (!predicate(element)) {
            tmp.push(element);
        } else if (index === 0 || tmp.length > 0) {
            newArr.push(tmp);
            tmp = [];
        }
        if (index === lastIndex) {
            newArr.push(tmp);
        }
        return newArr;
    }, [])
}
/*
serverConfig: {
  separole: { top: 'none', mid: 'keep', midgroup: 'all', bottom: 'none' },
  prefix: 's!'
}
*/

async function getConfig(guildId, config) {
    return config || getSeparoleConfig(guildId);
}

module.exports = SeparoleHandler;
