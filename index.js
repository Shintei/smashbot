//import * as firebase from "firebase/app";
//import "firebase/database";

const Discord = require('discord.js');
/*const firebase = require('firebase/app');
require('firebase/database');*/
const client = new Discord.Client();
const { token, prefix } = require('./config.json')
const { classes } = require('./models.json');
const BotFunctions = require('./BotFunctions.js');
const ClassFunctions = require('./ClassFunctions.js');
const Constants = require('./Constants.js');
const embedUtil = require('./utils/embedUtil');
const { GetCharacterMoveName, GetCharacterObjectDetails, GetCharacterMoveVisual, GetCharacterData, GetCharacterMove } = require('./BotFunctions.js');
const { GetNotFoundReactionUrl, GetLaughingReactionUrl } = require('./tenorFunctions');
const assetsLocation = './assets';
const characterModelsLocation = './assets/characterModels';
let firebaseDB = null;

client.once('ready', () => {
    //const firebaseDefault = firebase.initializeApp(firebaseConfig);
    //firebaseDB = firebaseDefault.database();
    console.log('Ready!');
}); //We don't need firebase here yet.

client.on('message', message => {
    //console.log(`${message.channel.name}: '${message.content}' from ${message.member.user.tag}`);

    if(message.content.startsWith(prefix)){
        if(message.channel.type !== 'text'){ //text for normal channels, dm for private messages and group for groups
            console.log('not my problem');
        }
        else if(message.content.startsWith(`${prefix}tr`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const queryString = contentArray[1];
            let numResults;
            if(contentArray.length > 2) {
                numResults = contentArray[2];
            }
            GetReaction(queryString, numResults)
                .then((response) => {
                    console.log('result is ');
                    console.log(response);
                    console.log('done retrieving reaction');
                })
                .catch((err) => {
                    console.log(`call threw error: ${err}`)
                })            
        }
        else if(message.content.startsWith(`${prefix}show`)){
            console.log('hit this block');
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const charNameInput = contentArray[1];
            const charMoveInput = contentArray[2];
            console.log(`input value is ${charNameInput}`)
            console.log(`input move is ${charMoveInput}`)
            GetCharacterMoveVisualEndpoint(charNameInput, charMoveInput)
                .then((response) => {
                    //console.log(`successful response `);
                    const messageEmbed = GetMoveVisualEmbed(response);
                    message.channel.send(message.author, messageEmbed);
                })
                .catch((err) => {
                    if(err === 'no image found'){
                        GetNotFoundReactionUrl()
                            .then((reactionUrl) => {
                                const attachment = new Discord.Attachment(reactionUrl);
                                message.channel.send(message.author, attachment)
                                message.channel.send(`Sorry fam, I could not find a hitbox visualization for ${charNameInput}'s ${charMoveInput}`);
                            })
                            .catch((err) => {
                                console.log(err);
                                message.channel.send(`Sorry fam, I could not find a hitbox visualization for ${charNameInput}'s ${charMoveInput}`);
                            })
                    }
                    else {
                        console.log(`call to GetCharacterObjectDetails threw error: ${err}`)
                        message.channel.send(`show usage: ${prefix}show {characterName} {characterMove}, ex: ${prefix}show Ike Fsmash`)
                    }
                    
                })
        }
        
        else if(message.content.startsWith(`${prefix}start`)){
            message.channel.send('Trying to add your user');
            AddUser(message.member.id, firebaseDB)
                .then((response) => {
                    message.channel.send(response === true ? `Added ${message.member.user.tag} to db` : `You already exist in our system.`);
                })
                .catch((err) => {
                    message.channel.send('something blew up, fam')
                })            
        }

        else if(message.content.startsWith(`${prefix}help`)){
            client.users.get(message.member.id).send('testing private messaging capability');
            message.channel.send('Sent you a message containing help information');
        }

        else if(message.content.startsWith(`${prefix}name`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const nameToAddForUser = contentArray[1];
            //scrub to make sure this is a valid class
            if(true){
                message.channel.send(`Assigning name for <@${message.member.id}>`);
                AddUserField(message.member.id, 'name', nameToAddForUser, firebaseDB)
                    .then((response) => {
                        message.channel.send('added your new name!');
                    })
                    .catch((err) => {console.log(err);})
            }
            else{
                message.channel.send(`Invalid name selection, please try again.`)
            }            
        }        
    }    
    else if(message.content.length > 7){
        const tokens = message.content.split(' ').filter((val) => {return val != ''});
        if(tokens.some(w => Constants.WORDS_THAT_GET_BACKAIRED.includes(w.toLowerCase()))){
            console.log('backair alternative test passed');
        }          
    }
})

client.login(token);
