function getDateFromSnowflake(snowflake) {
    const timestamp = (snowflake / 4194304) + 1420070400000
    return new Date(timestamp);
}

module.exports = getDateFromSnowflake;
