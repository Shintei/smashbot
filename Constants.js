module.exports = {
    CHARACTER_MAPPER : {
        BANJO: '73-Banjo&Kazooie.json',
        get BANJOANDKAZOOIE(){ return this.BANJO },
        BAYO: '63-Bayonetta.json'
    },
    ULTIMATE_CHARACTERS : {        
        BANJO: {
            dataFiles: ['73-Banjo&Kazooie.json'],
            uriComponent: "banjo_and_kazooie",
            movePrefix: "Banjo_Kazooie",
            uniqueMoves: {
                "UPSPECIAL": "ShockSpringJump",
                "SHOCKSPRINGJUMP": "ShockSpringJump",
                "SPRINGJUMP": "ShockSpringJump",
                "SIDESPECIAL": "Wonderwing",
                "WONDERWING": "Wonderwing",
                "DOWNSPECIAL": "RearEgg",
                "REAREGG": "RearEgg",
                "NEUTRALSPECIAL": "EggFiring_PNG",
                "EGGFIRING": "EggFiring_PNG",
            }
        },
        get BANJOANDKAZOOIE(){
            return this.BANJO
        },
        get BAYO() {
            return this.BAYONETTA
        },
        BAYONETTA: {
            uriComponent: "bayonetta",
            movePrefix: "Bayonetta",
            uniqueMoves: {
                "FTILT1": "FTilt1",
                "FTILT2": "FTilt2",
                "FTILT3": "FTilt3",
                "FAIR1": "FAir1",
                "FAIR2": "FAir2",
                "FAIR3": "FAir3",
                "UPSPECIAL": "WitchTwistG",
                "WITCHTWIST": "WitchTwistG",
                "AIRWITCHTWIST": "WitchTwistA",
                "WITCHTWISTAIR": "WitchTwistA",
                "SIDESPECIAL": "HeelSlide",
                "HEELSLIDE": "HeelSlide",
                "SIDEB2": "HeelSlideEnd",
                "SIDESPECIAL2": "HeelSlideEnd",
                "AIRSIDESPECIAL": "AfterburnerKickUp",
                "AIRSIDEB": "AfterburnerKickUp",
                "DOWNSPECIAL": "WitchTime",
                "WITCHTIME": "WitchTime",
                "NEUTRALSPECIAL": "BulletClimax",
                "BULLETCLIMAX": "BulletClimax",
            }
        },
        BOWSER: {
            uriComponent: "bowser",
        },
        get SERG(){
            return this.BOWSER
        },
        get "BOWSER JR"() {
            return this.BOWSERJR
        },
        BOWSERJR: {
            uriComponent: "bowser_jr",
        }       
    },

    GENERIC_MOVE_ALIASES_UFD : { //Visuals can be more specific than frame data. Ftilt-up shows ftilt-up but generic Ftilt frame data
        "Jab 1": "Jab1",
        "Jab 2": "Jab2",
        "Jab 3": "Jab3",
        "Jab": "Jab",
        "Rapid Jab": "JabRapid",
        "Rapid Finisher": "JabRapidEnd",
        "F-Tilt": "FTilt",
        "F-Tilt 1": "FTilt1",
        "F-Tilt 2": "FTilt2",
        "F-Tilt 3": "FTilt3",
        "U-Tilt": "UTilt",
        "D-Tilt": "DTilt",
        "Dash Attack": "DashAttack",
        "F-Smash": "FSmash",
        "D-Smash": "DSmash",
        "U-Smash": "USmash",
        "N-Air": "NAir",
        "F-Air": "FAir",
        "B-Air": "BAir",
        "U-Air": "UAir",
        "D-Air": "DAir",
        "Grab": "Grab",
        "Dash Grab": "DashGrab",
        "Pivot Grab": "PivotGrab",
        "Pummel": "Pummel",
        "Forward Throw": "FThrow",
        "Back Throw": "BThrow",
        "Up Throw": "UThrow",
        "Down Throw": "DThrow"
    },

    INTERNAL_MOVE_ALIASES : { //What do people normally call these moves?

    },

    STATIC_IMAGE_ADDRESSES : {
        FIUEMBLEM: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/FIU_Panthers_logo.svg/1200px-FIU_Panthers_logo.svg.png",
        SMASHLOGO: "https://www.pngitem.com/pimgs/m/4-49634_smash-ball-super-smash-bros-ultimate-logo-hd.png"
    },

    STATIC_STRINGS : {
        EMBEDFOOTER: "Brought to you with hate"
    }
}