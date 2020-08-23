//import * as firebase from "firebase/app";
//import "firebase/database";

const Discord = require('discord.js');
/*const firebase = require('firebase/app');
require('firebase/database');*/
const client = new Discord.Client();
const { token, prefix } = require('./config.json')
const { classes } = require('./models.json');
const BotFunctions = require('./BotFunctions.js');
const Constants = require('./Constants.js');
const embedUtil = require('./utils/embedUtil');
const dataUtil = require('./utils/dataUtil');
const { GetParsedArguments, IsAdmin, GetPrettifiedCharacterName } = require('./BotFunctions.js');
const { GetNotFoundReactionUrl, GetLaughingReactionUrl } = require('./externalAPIs/tenorFunctions');
const { GetTournaments } = require('./externalAPIs/smashGGFunctions');
const { GetMoveNotFoundEmbed } = require('./utils/embedUtil');
const { MoveNotFoundError, FrameAdvantageNotFoundError } = require('./errors/CustomErrors');
const { STATIC_STRINGS } = require('./Constants.js');
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
        else if(message.content.startsWith(`${prefix}tournies`)){
            GetTournaments()
                .then((resp) => {
                    console.log('successful response got back to index')
                    console.log(resp)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        else if(message.content.startsWith(`${prefix}characterMap`)){
            if(IsAdmin(message.member.id)){
                dataUtil.InitializeCharacterData();
            }
            else{
                message.channel.send(message.author, 'Fuck off, you aint my dad');
            }
            
        }
        else if(message.content.startsWith(`${prefix}punish`)){
            console.log('hit punish logic');
            GetParsedArguments(message.content, 3)
            .then((args) => {
                GetCharacterPunishes(args[0], args[1], args[2])
                .then((punishes) => {
                    message.channel.send(`ok, ${punishes.targetPunishAdvantage}`);
                    console.log('it worked!');
                    console.log(punishes);
                })
                .catch((err) => {
                    console.warn(err);
                    if(err instanceof FrameAdvantageNotFoundError){
                        message.channel.send(`${GetPrettifiedCharacterName(err.characterName)}'s ${err.characterMove} has no frame advantage listed to compare against.`);
                    }
                    else {
                        throw(err);
                    }
                })
            })
            .catch(() => {
                message.channel.send(Constants.STATIC_STRINGS.PUNISHUSAGEEXAMPLE);
            })
        }
        else if(message.content.startsWith(`${prefix}show`)){
            GetParsedArguments(message.content, 2)
            .then((args) => {
                GetCharacterMoveVisualEndpoint(args[0], args[1])
                .then((response) => {
                    const messageEmbed = GetMoveVisualEmbed(response);
                    message.channel.send(message.author, messageEmbed);
                })
                .catch((err) => {
                    if(err instanceof MoveNotFoundError && err.message === Constants.EXCEPTION_MESSAGES.MOVENOTFOUND){
                        const charName = err.characterName;
                        const actualCharacterName = charName.substring(charName.indexOf(' - ') + 3);
                        const failureMessage = `Sorry fam, I could not find a move matching ${actualCharacterName}'s ${charMoveInput}`;
                        GetNotFoundReactionUrl()
                            .then((reactionUrl) => {
                                const embedRequest = {};
                                embedRequest.imageUrl = reactionUrl;
                                embedRequest.message = failureMessage;
                                const messageEmbed = GetMoveNotFoundEmbed(embedRequest);
                                message.channel.send(message.author, messageEmbed);
                            })
                            .catch((err) => {
                                console.log(err);
                                message.channel.send(failureMessage);
                            })
                    }
                    else {
                        throw(err);
                    }                    
                });
            })
            .catch(() => {
                message.channel.send(Constants.STATIC_STRINGS.SHOWUSAGEEXAMPLE);
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
            console.log(`user ${message.author} with member id ${message.member.id} wants help`)
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
