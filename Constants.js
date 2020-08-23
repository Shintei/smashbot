const { prefix } = require('./config.json')

module.exports = {
    GENERIC_MOVE_ALIASES_UFD : { //Visuals can be more specific than frame data. Ftilt-up shows ftilt-up but generic Ftilt frame data
        "Jab 1": "Jab1",
        "Jab 2": "Jab2",
        "Jab 3": "Jab3",
        "Jab": "Jab",
        "Rapid Jab": "JabRapid",
        "Rapid Finisher": "JabRapidEnd",
        "F-Tilt": "FTilt",
        "F-TiltUp": "FTiltUp",
        "F-TiltDown": "FTiltDown",
        "F-Tilt 1": "FTilt1",
        "F-Tilt 2": "FTilt2",
        "F-Tilt 3": "FTilt3",
        "U-Tilt": "UTilt",
        "D-Tilt": "DTilt",
        "D-Tilt 1": "DTilt1",
        "D-Tilt 2": "DTilt2",
        "Dash Attack": "DashAttack",
        "F-Smash": "FSmash",
        "F-SmashUp": "FSmashUp",
        "F-SmashDown": "FSmashDown",
        "F-Smash (up)": "FSmashDown",
        "F-Smash (down)": "FSmashDown",
        "D-Smash": "DSmash",
        "U-Smash": "USmash",
        "N-Air": "NAir",
        "F-Air": "FAir",
        "F-AirUp": "FAirUp",
        "F-AirDown": "FAirDown",
        "B-Air": "BAir",
        "B-AirUp": "BAirUp",
        "B-AirDown": "BAirDown",
        "U-Air": "UAir",
        "D-Air": "DAir",
        "Z-Air": "ZAir",
        "Grab": "Grab",
        "Dash Grab": "DashGrab",
        "Pivot Grab": "PivotGrab",
        "Pummel": "Pummel",
        "Forward Throw": "FThrow",
        "Back Throw": "BThrow",
        "Up Throw": "UThrow",
        "Down Throw": "DThrow"
    },

    INTERNAL_MOVE_ALIASES : [ //What do people normally call these moves?
        {"Forward Smash": "F-Smash"},
        {"Up Smash": "U-Smash"},
        {"Down Smash": "D-Smash"},
        {"Forward Tilt": "F-Tilt"},
        {"Up Tilt": "U-Tilt"},
        {"Down Tilt": "D-Tilt"},
        {"Air Dodge": "Neutral Air Dodge"},
        {"Air Dodge Up": "Dir. AD (up)"},
        {"Air Dodge Down": "Dir. AD (down)"}
    ],

    STATIC_IMAGE_ADDRESSES : {
        FIUEMBLEM: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/FIU_Panthers_logo.svg/1200px-FIU_Panthers_logo.svg.png",
        SMASHLOGO: "https://www.pngitem.com/pimgs/m/4-49634_smash-ball-super-smash-bros-ultimate-logo-hd.png"
    },

    STATIC_STRINGS : {
        EMBEDFOOTER: "Brought to you with hate",
        SHOWUSAGEEXAMPLE: `show usage: ${prefix}show {characterName} {characterMove}, ex: ${prefix}show Ike Fsmash`,
        PUNISHUSAGEEXAMPLE: `punish usage: ${prefix}punish {characterName} {characterMove} {characterToPunishWith}, ex: ${prefix}punish Ike Aether Marth`,
        /*NOADVANTAGEONMOVE: '{0}\'s {1} has no frame advantage listed to compare against.'*/
    },

    EXCEPTION_MESSAGES:{
        MOVENOTFOUND: 'couldnt find the move',
        NOFRAMEADVANTAGEFOUND: ''
    },

    WORDS_THAT_GET_BACKAIRED : ["residual", "residually", "cornucopia"],

    TOKEN_DIVIDERS: [
        {
            openingToken: '(',
            closingToken: ')',
        },
        {
            openingToken: '"',
            closingToken: '"',
        },
        {
            openingToken: '[',
            closingToken: ']',
        }
    ]
}