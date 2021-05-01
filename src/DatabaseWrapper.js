// SEPAROLE CONFIG

const { SEPAROLER_CONFIG_OPTIONS } = require("./helpers/constants");

const separoleConfig = {};
const DEFAULT_SEPAROLE_CONFIG = {
    separole: {
        top: SEPAROLER_CONFIG_OPTIONS.TOP.DEFAULT,
        mid: SEPAROLER_CONFIG_OPTIONS.MID.DEFAULT,
        midgroup: SEPAROLER_CONFIG_OPTIONS.MIDGROUP.DEFAULT,
        bottom: SEPAROLER_CONFIG_OPTIONS.BOTTOM.DEFAULT
    },
    prefix: process.env.PREFIX
}
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

module.exports = {
    getSeparoleConfig,
    setSeparoleConfig,
    getSeparoleList,
    setSeparoleList
}
