// SEPAROLE CONFIG

const { SEPAROLER_CONFIG_OPTIONS } = require("./helpers/constants");

const separoleConfig = {};
const DEFAULT_SEPAROLE_CONFIG = {
    top: SEPAROLER_CONFIG_OPTIONS.TOP.DEFAULT,
    mid: SEPAROLER_CONFIG_OPTIONS.MID.DEFAULT,
    midgroup: SEPAROLER_CONFIG_OPTIONS.MIDGROUP.DEFAULT,
    bottom: SEPAROLER_CONFIG_OPTIONS.BOTTOM.DEFAULT
};

async function getSeparoleConfig(serverId) {
    if (!separoleConfig[serverId]) {
        await setSeparoleConfig(serverId, DEFAULT_SEPAROLE_CONFIG);
    }
    return separoleConfig[serverId];
    // return {
    //     separole: {
    //         top: "none",
    //         mid: "keep",
    //         midgroup: "all",
    //         bottom: "none"
    //     },
    //     prefix: "s!"
    // }
}

async function setSeparoleConfig(serverId, newConfig) {
    separoleConfig[serverId] = newConfig;
}

// SEPAROLE LIST
const separolesObj = {};
async function getSeparoleList(serverId) {
    if (!separolesObj[serverId]) {
        separolesObj[serverId] = [];
    }
    return separolesObj[serverId];
}

async function setSeparoleList(serverId, separoleList) {
    separolesObj[serverId] = separoleList;
}

const baseConfigs = {
}
async function getBaseConfig(guildId) {
    if (!baseConfigs[guildId]) {
        await setBaseConfig(guildId, {config: "s!"});
    }
    return baseConfigs[guildId];
}

async function setBaseConfig(guildId, config) {
    baseConfigs[guildId] = config;
}

module.exports = {
    getSeparoleConfig,
    setSeparoleConfig,
    getSeparoleList,
    setSeparoleList,
    getBaseConfig,
    setBaseConfig
}
