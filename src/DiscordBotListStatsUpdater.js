const axios = require("axios").default;

const { getTotalGuildCount, getSrUserCount } = require("./DatabaseWrapper");
const logger = require("./helpers/logger");

const url = `https://discordbotlist.com/api/v1/bots/${process.env.BOT_ID}/stats`;
const updateStatsCooldownMs = 10 * 60 * 1000; // 10 min

let lastUpdated = 0;
let lastGuildCount = 0;
let lastUserCount = 0;

const headers =  {
            Authorization: process.env.DISCORD_BOT_LIST_TOKEN
        }
async function updateDBLStats() {
    if (process.env.NODE_ENV !== "production") return;
    if (Date.now() - lastUpdated < updateStatsCooldownMs) return;
    lastUpdated = Date.now();
    try {
        const newUserCount = parseInt(await getSrUserCount(), 10);
        const newGuildCount = parseInt(await getTotalGuildCount(), 10);
        if (lastGuildCount === 0) {
            lastGuildCount = newGuildCount;
        }
        if (lastUserCount === 0) {
            lastUserCount = newUserCount;
        }
        if (newGuildCount <= lastGuildCount && newUserCount <= lastUserCount) {
            return;
        }

        await axios.post(url, {
            guilds: newGuildCount,
            users: newUserCount
        }, { headers });
        logger.info({
            msg: "Updated Discord Bot List Stats.",
            lastGuildCount,
            newGuildCount,
            lastUserCount,
            newUserCount
        });

        lastGuildCount = newGuildCount;
        lastUserCount = newUserCount;
    } catch (err) {
        logger.error({
            msg: "Error occurred while updating stats in discord bot list.",
            err
        });
    }
}

module.exports = updateDBLStats;
