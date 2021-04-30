async function invalidCommand(message, pluginName) {
    return message.channel.send({
        embed: {
            title: "Invalid Command!",
            description: `Sorry, that was an invalid command syntax. Please view \`s!help ${pluginName}\` for help on how to use this command.`,
            color: 16711680
        }
    })
}

module.exports = invalidCommand;
