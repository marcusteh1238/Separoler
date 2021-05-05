// SEPAROLE CONFIG
const { pool } = require("./db/Database");
const { SEPAROLER_CONFIG_OPTIONS } = require("./helpers/constants");
const logger = require("./helpers/logger");

const DEFAULT_PREFIX = process.env.PREFIX;

async function getBaseConfig(guildId) {
    const query = `
    WITH new_row as (
    INSERT INTO guild_base_config
    (guild_id, prefix)
    SELECT $1::varchar, NULL
    WHERE
        NOT EXISTS (
            SELECT * FROM guild_base_config WHERE guild_id = $1
        )
    RETURNING prefix)
    SELECT prefix FROM guild_base_config WHERE guild_id = $1
    UNION
    SELECT prefix FROM new_row;
`
    const { rows } = await performQuery(query, [guildId], "getBaseConfig");
    const [row] = rows;
    if (!row) {
        throw Error("Guild Base Config not found!");
    }
    row.prefix = row.prefix || DEFAULT_PREFIX;
    return row;
}

async function setBaseConfig(guildId, { prefix }) {
    const query = `
    UPDATE guild_base_config
    SET prefix = $2
    WHERE guild_id = $1;
`
    const { rows } = await performQuery(query, [guildId, prefix], "setBaseConfig");
    return rows[0];
}

/**
 * Assumes that the guild exists.
 * @param {string} guildId The guild to obtain separole config from.
 * @returns 
 */
async function getSeparoleConfig(guildId, withSeparoles = false) {
    let query = `
    SELECT top, mid, midgroup, bottom
    FROM guild_separole_config
    WHERE guild_id = $1;
`
    if (withSeparoles) {
        query = `
        SELECT top, mid, midgroup, bottom, separoles
        FROM guild_separole_config x
        FULL OUTER JOIN guild_separoles y
        ON x.guild_id = y.guild_id
        WHERE x.guild_id = $1;
        `
    }
    const {rows} = await performQuery(query, [guildId], "getSeparoleConfig");
    if (rows.length === 0) {
        const errorMessage = "The guild id supplied does not have a separole config entry in the database.";
        logger.error({
            msg: errorMessage,
            guildId
        })
        throw Error(errorMessage);
    }
    const [row] = rows;
    row.top = row.top || SEPAROLER_CONFIG_OPTIONS.TOP.DEFAULT;
    row.mid = row.mid || SEPAROLER_CONFIG_OPTIONS.MID.DEFAULT;
    row.midgroup = row.midgroup || SEPAROLER_CONFIG_OPTIONS.MIDGROUP.DEFAULT;
    row.bottom = row.bottom || SEPAROLER_CONFIG_OPTIONS.BOTTOM.DEFAULT;
    if (withSeparoles) {
        row.separoles = row.separoles || [];
    }
    return row;
}

async function setSeparoleConfig(guildId, {
    top,
    mid,
    midgroup,
    bottom
}) {
    const query = `
    UPDATE guild_separole_config
    SET top = $2, mid = $3, midgroup = $4, bottom = $5
    WHERE guild_id = $1;
`
    const arr = [guildId, top, mid, midgroup, bottom];
    const { rows } = await performQuery(query, arr, "setSeparoleConfig");
    return rows[0];
}

// SEPAROLE LIST
async function getSeparoleList(guildId) {
    const query = `
    SELECT separoles
    FROM guild_separoles
    WHERE guild_id = $1;
`
    const { rows } = await performQuery(query, [guildId], "getSeparoleList");
    const [row] = rows;
    row.separoles = row.separoles || [];
    return row;
}

async function setSeparoleList(guildId, separoleList) {
    const query = `
    UPDATE guild_separoles
    SET separoles = $2
    WHERE guild_id = $1;
`
    const arr = [guildId, separoleList];
    const { rows } = await performQuery(query, arr, "setSeparoleList");
    return rows[0];
}

async function performQuery(query, paramArray, funcName) {
    try {
        return pool.query(query, paramArray);
    } catch (err) {
        logger.error({
            msg: "Error occurred while performing Database Query.",
            funcName,
            query,
            paramArray,
            err
        });
        throw err;
    }
}

module.exports = {
    getSeparoleConfig,
    setSeparoleConfig,
    getSeparoleList,
    setSeparoleList,
    getBaseConfig,
    setBaseConfig
}
