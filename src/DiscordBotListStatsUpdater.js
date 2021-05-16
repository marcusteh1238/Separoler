const axios = require("axios").default;

const { getTotalGuildCount } = require("./DatabaseWrapper");
const logger = require("./helpers/logger");

const url = `https://discordbotlist.com/api/v1/bots/${process.env.BOT_ID}/stats`;
const updateStatsCooldownMs = 10 * 60 * 1000; // 10 min

let lastUpdated = 0;
let lastCount = 0;

const headers =  {
            Authorization: process.env.DISCORD_BOT_LIST_TOKEN
        }
async function updateDBLStats() {
    if (process.env.NODE_ENV !== "production") return;
    if (Date.now() - lastUpdated < updateStatsCooldownMs) return;
    lastUpdated = Date.now();
    try {
        const guildCount = parseInt(await getTotalGuildCount(), 10);
        if (lastCount === 0) {
            lastCount = guildCount;
            return;
        }
        if (guildCount <= lastCount) {
            return;
        }
        await axios.post(url, {
            guilds: guildCount
        }, { headers });
        logger.info({
            msg: "Updated number of guilds in Discord Bot List.",
            oldCount: lastCount,
            newCount: guildCount
        });
        lastCount = guildCount;
    } catch (err) {
        logger.error({
            msg: "Error occurred while updating stats in discord bot list.",
            err
        });
    }
}

module.exports = updateDBLStats;
