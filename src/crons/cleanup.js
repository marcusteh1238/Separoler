const superagent = require("superagent");

const DiscordClient = require("../DiscordClient");
const getDateFromSnowflake = require("../helpers/getDateFromSnowflake");

const testServerIdAndPayload = {
    "843474660641079337": [
        {
            channelId: "843474661471158284",
            age: 1
        }
    ]
}
/**
 * Expected payload: { [serverId: string]: [channelsAndAge: string]: Array<{channelId: string, age: number}>}
 */
async function cleanup() {
    // TODO: Get all server configs and stuff from db
    const serverIdsAndPayloads = testServerIdAndPayload;
    const payloads = (await Promise.all(Object.entries(serverIdsAndPayloads)
    .map(async ([guildId, channelsAndAge]) => {
        const guild = DiscordClient.guilds.cache.get(guildId) || await DiscordClient.guilds.fetch(guildId);
        if (!guild) return [];
        return (await Promise.all(channelsAndAge.map(async ({ channelId, age }) => {
            const channel = guild.channels.cache.get(channelId) || await DiscordClient.channels.fetch(channelId);
            if (!channel) {
                return null;
            }
            return {
                channel,
                age
            };
        })))
        .filter(payload => Boolean(payload));
    })))
    .reduce((prev, curr) => prev.concat(curr), []);
    if (payloads.length === 0) {
        return;
    }
    const channelsAndMessages = await Promise.all(payloads.map(async ({ channel, age }) => {
        const messages = await getAllMessagesFromChannel(channel.id, age);
        return {
            messages,
            channel,
            age
        }
    }));
    await Promise.all(channelsAndMessages.map(({messages, channel}) => channel.bulkDelete(messages.map(({id}) => id))))
}

/**
 * Limit to 100.
 * @param {string} channelId snowflake of channel
 * @param {number} age in hours 
 */
async function getAllMessagesFromChannel(channelId, age) {
    let messages = [];
    let lastMessageId = null;
    const dateToDeleteFrom = new Date(Date.now() - age * 60 * 60 * 1000);
    const dateToDeleteFromVal = dateToDeleteFrom.valueOf();
    const twoWeeksAgoVal = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).valueOf();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const prevMessages = await getMessagesFromChannel(channelId, lastMessageId);
        if (prevMessages.length === 0) {
            return messages;
        }
        const newLastMessageId = prevMessages[prevMessages.length - 1].id;
        const lastMsgDate = getDateFromSnowflake(newLastMessageId);
        // if last sent message is to be deleted
        if (prevMessages[0].id <= dateToDeleteFromVal) {
            messages = messages.concat(prevMessages);
        } else if (lastMsgDate.valueOf() <= dateToDeleteFromVal) {
            messages = messages.concat(prevMessages.filter(msg => {
                const snowflakeDate = getDateFromSnowflake(msg.id).valueOf();
                return snowflakeDate <= dateToDeleteFromVal &&
                    snowflakeDate > twoWeeksAgoVal;
            }))
        }
        if (messages.length >= 100) {
            return messages.slice(0, 100);
        }
        if (prevMessages.length < 100) {
            return messages;
        }
        lastMessageId = newLastMessageId;
    }
}

async function getMessagesFromChannel(channelId, lastMessageId) {
    const queryObj = {
        limit: 100 
    }
    if (lastMessageId) {
        queryObj.before = lastMessageId;
    }
    return superagent
    .get(`https://discord.com/api/channels/${channelId}/messages`)
    .query(queryObj)
    .set("Authorization", `Bot ${process.env.BOT_TOKEN}`).then(({body}) => body)
}
module.exports = cleanup;