const { error_red } = require("../colors");

async function errorOccured(message, description) {
    return message.channel.send({
        embed: {
            title: "Sorry, an Error Occurred!",
            description,
            color: error_red
        }
    })
}

module.exports = errorOccured;
