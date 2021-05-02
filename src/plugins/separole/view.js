const { unsure_yellow, info_lavendar } = require("../../helpers/colors");
const { MAX_SEPAROLES } = require("../../helpers/constants");
const getUserAvatarURL = require("../../helpers/getUserAvatarURL");

async function viewSeparoles(message, separoles) {
    const avatarIcon = getUserAvatarURL(message.author)
    if (separoles.length === 0) {
        return message.channel.send({
            embed: {
                title: "No Separoles to Display!",
                color: unsure_yellow,
                description: `Add some Separoles using \`s!separoles add <role_id>\`! You can currently add up to **${MAX_SEPAROLES.DEFAULT}** Separoles!`
            }
        })
    }
    separoles.sort((roleA, roleB) => roleA.position - roleB.position);
    const roleString = separoles.map((role, index) => {
        const mention = `<@&${role.id}>`;
        const pos = role.rawPosition;
        return `${index + 1}. ${mention} - (Position \`#${pos}\`)`
    }).join('\n');
    const footerText = `${message.guild.name} currently has ${separoles.length} out of ${MAX_SEPAROLES.DEFAULT} maximum allowed Separoles.`
    return message.channel.send({
        embed: {
            title: "Current List of Separoles",
            description: roleString,
            color: info_lavendar,
            footer: {
                text: footerText,
                icon_url: avatarIcon
            }
        }
    });
}



module.exports = viewSeparoles;
