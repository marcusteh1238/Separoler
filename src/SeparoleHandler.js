// eslint-disable-next-line no-unused-vars
const {Guild, GuildMember} = require("discord.js");
const { getSeparoleConfig } = require("./DatabaseWrapper");
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
async function SeparoleHandler(guild, member, {separoleStrArr, config} = {}) {
    const [separoles, serverConfig, serverRoleManager] = await Promise.all([
        getCurrentSeparoles(guild, separoleStrArr),
        getConfig(guild.id, config),
        guild.roles.fetch()
    ]);
    const userRoles = member.roles.cache.array()
        .filter(role => role.id !== serverRoleManager.everyone.id); // everyone role not displayed.
    // assume all separoles equipped on user.
    const userWithoutSeparoles = userRoles
        .filter(ur => !separoles.some(sr => sr.id === ur.id))
    const currEquippedSeparoles = userRoles
        .filter(ur => separoles.some(sr => sr.id === ur.id))
    const userWithAllSeparoles = userWithoutSeparoles
        .map(({ id, position }) => ({ id, position, isSeparole: false }))
        .concat(separoles.map(({ id, position }) => ({ id, position, isSeparole: true })));

    userWithAllSeparoles.sort((role1, role2) => role2.position - role1.position);
    // separate into groups.
    const groups = getSeparoleGroups(userWithAllSeparoles);
    // apply policy based on server config to get roles that are supposed to be equipped.
    const newBottom = performPolicyOnRoles(groups.bottom, serverConfig.separole.bottom);
    const newTop = performPolicyOnRoles(groups.top, serverConfig.separole.top);
    const newMid = performPolicyOnRoles(groups.mid, serverConfig.separole.mid)
        .map(arr => performPolicyOnRoles(arr, serverConfig.separole.midgroup))
        .flat();

    // get roles to add and remove.
    const newEquippedSeparoles = newTop
        .concat(newMid)
        .concat(newBottom);
    const promises = [];

    const rolesToAdd = newEquippedSeparoles
        .filter(({ id }) => !currEquippedSeparoles.some(role => role.id === id))
        .map(({ id }) => id);
    if (rolesToAdd.length > 0) {
        promises.push(member.roles.add(rolesToAdd));
    }
    
    const rolesToRemove = currEquippedSeparoles
        .filter(({ id }) => !newEquippedSeparoles.some(role => role.id === id))
        .map(({ id }) => id);
    if (rolesToRemove.length > 0) {
        promises.push(member.roles.remove(rolesToRemove));
    }

    if (promises.length === 0) return;

    try {
        await Promise.all(promises);
        logger.debug(getDebugObj("Updating separoles", guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove));
    } catch (err) {
        logger.error(getDebugObj("Error occurred when updating separoles", guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove));
    }
}

function getDebugObj(msg, guild, member, separoles, currEquippedSeparoles, newEquippedSeparoles, rolesToAdd, rolesToRemove) {
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
        rolesToRemove
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

function getSeparoleGroups(rolesList) {
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
