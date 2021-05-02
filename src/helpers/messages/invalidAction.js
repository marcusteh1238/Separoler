const { error_red } = require("../colors");

async function invalidAction(message, description) {
    return message.channel.send({
        embed: {
            title: "Invalid Action!",
            description,
            color: error_red
        }
    })
}

module.exports = invalidAction;
