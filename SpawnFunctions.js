const Discord = require('discord.js');
const firebase = require('firebase/app');
require('firebase/database');
const assetsLocation = './assets';
const characterModelsLocation = './assets/characterModels';
const { classes } = require('./models.json');
const spawnLocation = './assets/spawns';
const Spawns = require('./Spawns.js');

module.exports = {
    GetSpawn: () => {
        let spawnArray = [];
        let spawnSeed = (Math.floor(Math.random() * 20)+1) ;
        if (spawnSeed === 1){ //waaah, legendary
            spawnArray = Spawns.LegendarySpawns;
        }
        //else if(spawnSeed === 1 || spawnSeed === 2){}
        else{ //normal
            spawnArray = Spawns.CommonSpawns;
        }
        //console.log(`length of array is ${spawnArray.length}`);
        const spawnIndex = (Math.floor(Math.random() * spawnArray.length));
        //console.log(`Random spawn index is ${spawnIndex}`);
        const spawnObject = spawnArray[spawnIndex];
        //console.log('spawn object:');
        //console.log(spawnObject);
        let embedObject = module.exports.GetEmbedObject(spawnObject);
        if(embedObject === undefined){
            return undefined;
        }
        else{
            //console.log(embedObject);
            const richEmbed = new Discord.RichEmbed()
                .setTitle(embedObject.embedTitle)
                .setDescription(embedObject.description)
                .attachFiles(embedObject.fileLocations)
                .setImage(embedObject.imageLocation);
            return richEmbed;
        }
        
    },

    GetEmbedObject: (spawnObject) => {
        if(spawnObject === null || spawnObject === undefined){
            return undefined;
        }
        let embedObject = {};
        Object.defineProperties(embedObject, {
            embedTitle: {
                value: `${spawnObject.name} has entered the arena!`,
                writable: false
            },
            description: {
                value: `To take on this video game icon, type r!challenge`,
                writable: false
            },
            fileLocations: {
                value: [`${spawnLocation}/${spawnObject.imageLocation}`],
                writable: false
            },
            imageLocation: {
                value: `attachment://${spawnObject.imageLocation}`,
                writable: false
            }
        });            
        return embedObject;
    }
}
