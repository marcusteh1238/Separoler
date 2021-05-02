function getUserAvatarURL(user) {
    return user.avatarURL({ dynamic: true, size: 128 });
}

module.exports = getUserAvatarURL;
