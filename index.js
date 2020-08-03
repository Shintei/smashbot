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
const SpawnFunctions = require('./SpawnFunctions.js');
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
        else if(message.content.startsWith(`${prefix}testCharData`)){
            console.log('calling getcharacterdata');
            GetCharacterData();
            console.log('back from calling getcharacterdata');
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
        else if(message.content.startsWith(`${prefix}move`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const charNameInput = contentArray[1];
            const charMoveInput = contentArray[2];
            console.log(`attempting move retrieval for move ${charMoveInput} and char ${charNameInput}`);
            GetCharacterMove(charNameInput, charMoveInput)
                .then((response) => {
                    console.log('char move result is ');
                    console.log(response);
                    console.log('done retrieving move');
                })
                .catch((err) => {
                    console.log(`call to GetCharacterMove threw error: ${err}`)
                })            
        }
        else if(message.content.startsWith(`${prefix}testCharMapping`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const charNameInput = contentArray[1];
            console.log(`calling getcharactermapping with param ${charNameInput}`);
            GetMappings(charNameInput);
            console.log('back from calling getcharactermapping');
        }
        else if(message.content.startsWith(`${prefix}show`)){
            console.log('hit this block');
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const charNameInput = contentArray[1];
            const charMoveInput = contentArray[2];
            console.log(`input value is ${charNameInput}`)
            console.log(`input move is ${charMoveInput}`)
            let charContext = GetCharacterMoveVisualEndpoint(charNameInput, charMoveInput)
                .then((response) => {
                    console.log(`successful response `);
                    //console.log(response);
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
            message.channel.send('Sent you a message containing RPGCord help information');
        }

        else if(message.content.startsWith(`${prefix}classes`)){
            message.channel.send(classes.join(','));
            const file = new Discord.Attachment('https://i.imgur.com/wSTFkRM.png');
            message.channel.send({files: [file]});
            const exampleEmbed = new Discord.RichEmbed()
                .setTitle('rich embed test')
                .attachFiles([characterModelsLocation + '/BLM2.png'])
                .setImage('attachment://BLM2.png');
            message.channel.send('testing richembed');
            message.channel.send(exampleEmbed); 
            message.channel.send('ending richembed test');
            const classEmbed = {
                color: 0x0099ff,
                title: 'Some title',
                url: 'https://discord.js.org',
                author: {
                    name: 'Some name',
                    icon_url: 'https://i.imgur.com/wSTFkRM.png',
                    url: 'https://discord.js.org',
                },
                description: 'Some description here',
                thumbnail: {
                    url: 'https://firebasestorage.googleapis.com/v0/b/zorarpg-1cf90.appspot.com/o/BLM2.png?alt=media&token=c6e5fe49-9ca3-4e0f-94d5-2af547a25809',
                },
                fields: [
                    {
                        name: 'Regular field title',
                        value: 'Some value here',
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                    },
                    {
                        name: 'Inline field title',
                        value: 'Some value a here',
                        inline: true,
                    },
                    {
                        name: 'Inline field title',
                        value: 'Some value b here',
                        inline: true,
                    },
                    {
                        name: 'Inline field title',
                        value: 'Some value c here',
                        inline: true,
                    },
                ],
                image: {
                    url: 'https://firebasestorage.googleapis.com/v0/b/zorarpg-1cf90.appspot.com/o/BLM2.png?alt=media&token=c6e5fe49-9ca3-4e0f-94d5-2af547a25809',
                },
                footer: {
                    text: 'Some footer text here',
                    icon_url: 'https://i.imgur.com/wSTFkRM.png',
                },
            };
            
            message.channel.send({embed: classEmbed});
        }

        else if(message.content.startsWith(`${prefix}class`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const classInput = contentArray[1];
            //scrub to make sure this is a valid class
            if(classes.map((className) => {return className.toLowerCase()}).includes(classInput.trim().toLowerCase())){
                let classToDisplay = classInput.trim();
                console.log(`class to display is ${classToDisplay}`);
                message.channel.send(`Attempting to map class '${classToDisplay}'`);
                const richEmbed = ClassFunctions.GetEmbedForClass(classToDisplay);
                if(richEmbed === undefined){
                    message.channel.send(`Unable to map the class ${classToDisplay} :/`)
                }
                else{
                    message.channel.send(richEmbed);
                }
                /*
                AddUserField(message.member.id, 'class', classToAddForUser, firebaseDB)
                    .then((response) => {
                        message.channel.send('added your class choice!');
                    })
                    .catch((err) => {console.log(err);})*/
            }
            else{
                message.channel.send(`Invalid class selection, please enter \`${prefix}classes\` for a list of available choices.`)
            }            
        }

        else if(message.content.startsWith(`${prefix}choose class`)){
            const contentArray = message.content.split(' ').filter((val) => {return val != ''});
            const classToAddForUser = contentArray[1];
            //scrub to make sure this is a valid class
            if(classes.includes(classToAddForUser.trim())){
                message.channel.send(`Assigning class for <@${message.member.id}>`);
                AddUserField(message.member.id, 'class', classToAddForUser, firebaseDB)
                    .then((response) => {
                        message.channel.send('added your class choice!');
                    })
                    .catch((err) => {console.log(err);})
            }
            else{
                message.channel.send(`Invalid class selection, please enter \`${prefix}classes\` for a list of available choices.`)
            }            
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

        else if(message.content.startsWith(`${prefix}lobby`)){
            const contentArray = message.content.split(`${prefix}lobby `).filter((val) => {return val != ''});
            let lobbyName = contentArray[0];
            console.log(`lobbyName is ${lobbyName}`);
            if(lobbyName === undefined || lobbyName === ''){
                lobbyName = 'someTestLobbyName';
            }
            const guild = message.member.guild;
            guild.createChannel(lobbyName, 'text', [{
                type: 'role',
                id: message.guild.id,
                permissions: 1024,
                deny: 0x400
            }])
                .then(response => console.log(response.id))
                .catch(console.error);
        }

        else if(message.content.startsWith(`${prefix}voice`)){
            const contentArray = message.content.split(`${prefix}voice `).filter((val) => {return val != ''});
            let lobbyName = contentArray[0];
            console.log(`lobbyName is ${lobbyName}`);
            if(lobbyName === undefined || lobbyName === ''){
                lobbyName = 'someTestVoiceLobbyName';
            }
            const guild = message.member.guild;
            guild.createChannel(lobbyName, 'voice', [{
                type: 'role',
                id: message.guild.id,
                permissions: 1024,
                deny: 0x400
            }])
                .then(response => console.log(response.id))
                .catch(console.error);
        }

        else if(message.content.startsWith(`${prefix}imageTest`)){
            message.channel.send('image test', {
                file: `${characterModelsLocation}/BLM2.png`
            })
        }

        else if(message.content.startsWith(`${prefix}showCharacter`)){

        }
    }    
})

client.login(token);
