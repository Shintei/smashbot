const Discord = require('discord.js');
const firebase = require('firebase/app');
require('firebase/database');
const assetsLocation = './assets';
const characterModelsLocation = './assets/characterModels';
const { classes } = require('./models.json');

module.exports = {
    GetEmbedForClass: (classInputInitial) => {
        const classInput = classInputInitial.toLowerCase();
        let embedObject = module.exports.GetEmbedObject(classInput);
        if(embedObject === undefined){
            return undefined;
        }
        else{
            console.log(embedObject);
            const richEmbed = new Discord.RichEmbed()
                .setTitle(embedObject.embedTitle)
                .attachFiles(embedObject.fileLocations)
                .setImage(embedObject.imageLocation);
            return richEmbed;
        }
        
    },

    GetEmbedObject: (classInput) => {
        const embedObject = {};
        switch(classInput){
            case 'mage':
                Object.defineProperties(embedObject, {
                    embedTitle: {
                        value: 'mage test title',
                        writable: false
                    },
                    fileLocations: {
                        value: [characterModelsLocation + '/BLM2.png'],
                        writable: false
                    },
                    imageLocation: {
                        value: 'attachment://BLM2.png',
                        writable: false
                    }
                });            
                return embedObject;
            default:
                break;
        }
        return undefined;
    }
}
