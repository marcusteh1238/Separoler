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

async function setPrefix(guildId, prefix) {
    const query = `
    UPDATE guild_base_config
    SET prefix = $2
    WHERE guild_id = $1;
`
    const { rows } = await performQuery(query, [guildId, prefix], "setPrefix");
    return rows[0];
}

/**
 * Assumes that the guild exists.
 * @param {string} guildId The guild to obtain separole config from.
 * @returns 
 */
async function getSeparoleConfig(guildId, withSeparoles = false) {
    let query = `
    SELECT top, mid, midgroup, bottom, is_global_enabled
    FROM guild_separole_config
    WHERE guild_id = $1;
`
    if (withSeparoles) {
        query = `
        SELECT top, mid, midgroup, bottom, separoles, is_global_enabled
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
    row.is_global_enabled = row.is_global_enabled !== undefined ? row.is_global_enabled : true;
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

async function getSeparoleListV2(guildId) {
    const query = `
    SELECT separole
    FROM guild_separoles_new
    WHERE guild_id = $1;
`;
    const { rows } = await performQuery(query, [guildId], "getSeparoleListV2");
    const separoles = rows.map(({ separole }) => separole);
    return { separoles };
}

async function addAndRemoveSeparolesV2(guildId, separolesToAdd = [], separolesToRemove = []) {
    if (separolesToAdd.length + separolesToRemove.length === 0) {
        return;
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        if (separolesToRemove.length > 0) {
            const delQuery = `DELETE FROM guild_separoles_new
            WHERE guild_id = $1 AND separole = ANY($2);`
            await client.query(delQuery, [guildId, separolesToRemove]);
        }
        if (separolesToAdd.length > 0) {
            const addQuery = `INSERT INTO guild_separoles_new (guild_id, separole)
            values($1, unnest($2::varchar[]));`
            await client.query(addQuery, [guildId, separolesToAdd]);
        }
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK;")
        throw e;
    } finally {
        client.release();
    }
}

async function setSeparoleListV2(guildId, separoleList = []) {
    const { separoles } = getSeparoleListV2(guildId);
    const separolesToAdd = separoleList.filter(s => !separoles.includes(s));
    const separolesToRemove = separoles.filter(s => !separoleList.includes(s));
    return addAndRemoveSeparolesV2(guildId, separolesToAdd, separolesToRemove)
}

async function isSeparolerEnabled(guildId) {
    const query = `
    SELECT is_global_enabled
    FROM guild_separole_config
    WHERE guild_id = $1
`;
    const arr = [guildId];
    const { rows } = await performQuery(query, arr, "isSeparolerEnabled");
    return rows[0] === undefined
        ? rows[0].is_global_enabled
        : true;
}

async function setSeparolerEnabled(guildId, isEnabled) {
    const query = `
    UPDATE guild_separole_config
    SET is_global_enabled = $2
    WHERE guild_id = $1;
`;
    const arr = [guildId, isEnabled];
    const { rows } = await performQuery(query, arr, "setSeparolerEnabled");
    return rows;
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
    getSeparoleListV2,
    setSeparoleListV2,
    addAndRemoveSeparolesV2,
    getBaseConfig,
    setPrefix,
    isSeparolerEnabled,
    setSeparolerEnabled
}

// async function migrate() {
//     const query1 = `
//     SELECT guild_id
//     FROM guild_base_config;
// `;
//     const {rows} = await performQuery(query1, [], "blah");
//     const allGuilds = rows.map(({ guild_id }) => guild_id);
//     const promises = await Promise.all(allGuilds
//         .map(async guildId => {
//             const { separoles } = await getSeparoleList(guildId);
//             await Promise.all(separoles.map(async separole => {
//                 const query2 = `
//                 INSERT INTO guild_separoles_new (guild_id, separole)
//                 VALUES ($1, $2);
//                 `
//                 await performQuery(query2, [guildId, separole], "blah2");
//             }))

//         }))
// }

// migrate()
