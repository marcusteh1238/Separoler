async function invalidAction(message, description) {
    return message.channel.send({
        embed: {
            title: "Invalid Action!",
            description,
            color: 16711680
        }
    })
}

module.exports = invalidAction;
