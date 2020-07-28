const Constants = require('./Constants.js');
const assetsLocation = './assets';
const characterModelsLocation = './assets/characterModels';
const spawnLocation = './assets/spawns';

//maybe the image locations should just be the last bit and leave it up to the index to say where the spawn folder is
//Fun TODOs: Do we want to play a voice clip on spawn?
module.exports = {
    Spawns: [
        {
            "name": "Link",
            "imageLocation": "link.png",
            "rarity": Constants.COMMON
        },

        {
            "name": "Master Chief",
            "imageLocation": "masterchief.png",
            "rarity": Constants.LEGENDARY
        },

        {
            "name": "Pacman",
            "imageLocation": "pacman.png",
            "rarity": Constants.COMMON
        },
    ],

    CommonSpawns: [
        {
            "name": "Link",
            "imageLocation": "link.png",
            "rarity": Constants.COMMON
        },
		
		{
            "name": "Ezio Auditore",
            "imageLocation": "ezioauditore.png",
            "rarity": Constants.COMMON
        },
		
		{
            "name": "Sora",
            "imageLocation": "sora-kh.png",
            "rarity": Constants.COMMON
        },
		
		{
            "name": "Crash",
            "imageLocation": "crash-bandicoot.png",
            "rarity": Constants.COMMON
        },
		
		{
            "name": "Joe",
            "imageLocation": "viewtiful-joe.png",
            "rarity": Constants.COMMON
        },

        {
            "name": "Pacman",
            "imageLocation": "pacman.png",
            "rarity": Constants.COMMON
        },
    ],

    LegendarySpawns: [
        {
            "name": "Master Chief",
            "imageLocation": "masterchief.png",
            "rarity": Constants.LEGENDARY
        }
    ]
}