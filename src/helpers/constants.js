const constants = {
    BOT_ID: process.env.BOT_ID,
    BOT_PERMISSIONS: 3020286145,
    MAX_SEPAROLES: {
        DEFAULT: 5,
        SUPPORTER: 10
    },
    SEPAROLER_CONFIG_OPTIONS: {
        TOP: {
            FRIENDLY_NAME: "Top-most Separoles",
            DESCRIPTION: "Policy when Separoles are the highest role that a user has.",
            OPTIONS: [
                "none",
                "lowest",
                "highest"
            ],
            DEFAULT: "none"
        },
        MID: {
            FRIENDLY_NAME: "Middle Separoles",
            DESCRIPTION: "Policy when the user has Separoles in-between other Discord roles.",
            OPTIONS: [
                "keep",
                "remove"
            ],
            DEFAULT: "keep"
        },
        MIDGROUP: {
            FRIENDLY_NAME: "Grouped Middle Separoles",
            DESCRIPTION: "Policy when the user has a bunch of Separoles grouped together in-between other Discord roles.",
            OPTIONS: [
                "all",
                "none",
                "lowest",
                "highest"
            ],
            DEFAULT: "all"
        },
        BOTTOM: {
            FRIENDLY_NAME: "Bottom-most Separoles",
            DESCRIPTION: "Policy when Separoles are the lowest role that a user has.",
            OPTIONS: [
                "none",
                "lowest",
                "highest"
            ],
            DEFAULT: "none"
        }
    },
    NUMBER_EMOJIS: [
        ":zero:",
        ":one:",
        ":two:",
        ":three:",
        ":four:",
        ":five:",
        ":six:",
        ":seven:",
        ":eight:",
        ":nine:",
        ":ten:"
    ]
}

module.exports = constants;
