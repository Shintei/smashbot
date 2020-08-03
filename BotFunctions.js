const firebase = require('firebase/app');
require('fuzzyset');
require('firebase/database');
const characterMappings = require('./utils/characterMapper.js');
const characterData = require('./data');
const { prefix, frameDataApiBaseUrl, token, firebaseConfig } = require('./config.json');
const { ULTIMATE_CHARACTERS, MOVE_LIST, GENERIC_MOVE_ALIASES_UFD } = require('./Constants.js');
const { Attachment } = require('discord.js');

module.exports = {
    GetCharacterData: GetCharacterData = () => {
        //console.log(characterData);
    },

    GetCharacterMappings: GetCharacterMappings = (charName) => {
        return new Promise((resolve, reject) => {
            if(charName == null){
                reject('char name cant be null');
            }
            const closestMatch = GetClosestMatch(charName.toUpperCase(), characterMappings);
            if(closestMatch == null){
                reject(`couldnt find character match for ${charName}`);
            }
            console.log(`closest match is ${closestMatch}`);
            console.log('match is');
            const returnVal = characterMappings[closestMatch];
            resolve(returnVal);
        });
    },

    GetCharacterMoveVisualEndpoint: GetCharacterMoveVisualEndpoint = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            const returnObj = {};
            if(charName == null){ reject('char name cant be null'); }
            GetCharacterMappings(charName)
            .then((character) => {
                if(character == null){ reject('couldnt find a character match'); }
                console.log(character);
                returnObj.characterName = character.name;
                const actualCharMoveData = GetCharacterMoveFromCharacter(charMove, character);                
                if(actualCharMoveData == null){reject('move data is null');}
                returnObj.moveDetails = actualCharMoveData;
                const charMoveNameKey = actualCharMoveData.searchKey;

                //first check if the move has the ufdName
                const ufdName = actualCharMoveData.payload.ufdName;                
                const resultArr = [];
                if(ufdName != null){
                    const hasMultipleResults = Array.isArray(ufdName);
                    if(hasMultipleResults){
                        ufdName.forEach(moveName => {
                            resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${character.uriComponent}/${character.movePrefix}${moveName}`);
                        });
                    }
                    else{
                        console.log(`ufd name is ${ufdName}`);
                        resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${character.uriComponent}/${character.movePrefix}${ufdName}`);                        
                    }                                        
                }
                else if(charMoveNameKey in GENERIC_MOVE_ALIASES_UFD === false){ //no ufdname in move and move is not generic, yikes!
                    //reject('no image found');                    
                }
                else { //generically named move, we can finish
                    const ufdName = GENERIC_MOVE_ALIASES_UFD[charMoveNameKey];
                    resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${character.uriComponent}/${character.movePrefix}${ufdName}.gif`);
                }
                returnObj.imageUrls = resultArr;
                resolve(returnObj);
            })
            .catch((err) => {
                console.error(err)
            })               
        });        
    },

    GetCharacterMove: GetCharacterMove = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            if(charName == null){ reject('char name cant be null'); }
            GetCharacterMappings(charName)
            .then((character) => {
                if(character == null){ reject('couldnt find a character match'); }
                const actualCharMoveData = GetCharacterMoveFromCharacter(charMove, character);
                if(actualCharMoveData == null){reject('move data is null');}
                resolve(actualCharMoveData.payload);
            })
            .catch((err) => {
                console.error(err)
            })               
        });        
    },

    GetCharacterMoveFromCharacter: GetCharacterMoveFromCharacter = (charMove, charDetails) => {
        if(charDetails == null){
            return null;
        }
        const possibleCharMoves = charDetails.moves;
        if(possibleCharMoves == null){
            return null;
        }
        const chosenMove = GetClosestMatch(charMove, possibleCharMoves);
        if(chosenMove == null){
            return null;
        }
        let result = {};
        result.searchKey = chosenMove;
        result.payload = possibleCharMoves[chosenMove];
        return result;
    },

    GetCharacterObjectDetails: GetCharacterObjectDetails = (charName) => {
        return new Promise((resolve, reject) => {
            const closestMatch = GetClosestMatch(charName.toUpperCase(), ULTIMATE_CHARACTERS);
            if(closestMatch == null){
                reject(`couldnt find a match for char name ${charName}`);
            }
            resolve(ULTIMATE_CHARACTERS[closestMatch]);
        });
    },
/*
    GetCharacterMoveVisualEndpoint: GetCharacterMoveVisualEndpoint = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            GetCharacterObjectDetails(charName)
                .then((response) => {
                    if(response === undefined){
                        reject('response from GetCharacterObjectDetails was undefined');
                    }
                    var characterUriBaseEndpoint = response.uriComponent;
                    var characterMovePrefix =  response.movePrefix;
                    let actualMoveSelection = GetCharacterMoveName(charMove, response);
                    console.log(`actual move name is ${actualMoveSelection}`);
                    if(actualMoveSelection == null || actualMoveSelection == undefined){
                        reject(`couldnt find a matching move to match ${charMove}`);
                    }
                    actualMoveSelection = actualMoveSelection.endsWith('_PNG') ? actualMoveSelection.replace('_PNG', '.png') : `${actualMoveSelection}.gif`
                    const attachmentUrl = `${frameDataApiBaseUrl}/hitboxes/${characterUriBaseEndpoint}/${characterMovePrefix}${actualMoveSelection}`;
                    console.log(`attachment url is: ${attachmentUrl}`);
                    resolve(attachmentUrl);
                })
                .catch((err) => {
                    console.log('something blew up, fam');
                    reject(err);
                })  
        });
    },
*/
    GetCharacterMoveName: GetCharacterMoveName = (charMove, contextCharacter) => {
        const characterMoves = contextCharacter.uniqueMoves;   
        const quickMatch = GetClosestMatch(charMove.toUpperCase(), contextCharacter.uniqueMoves);
        if(quickMatch !== null){
            return characterMoves[quickMatch];
        }
        const firstMoveMatchAttempt = GetClosestMatch(charMove.toUpperCase(), MOVE_LIST);
        let actualMoveSelection;
        let moveMapLookupValue;
        console.log(`firstMovematchattempt val: ${firstMoveMatchAttempt}`);
        if(firstMoveMatchAttempt != null){
            moveMapLookupValue = MOVE_LIST[firstMoveMatchAttempt];
        }
        if(firstMoveMatchAttempt === null || MOVE_LIST[firstMoveMatchAttempt].includes('SPECIAL')){
            //Try to look it up from the character
            let closestMatch;                         
            if(firstMoveMatchAttempt == null){ //They must have picked a specific special move name because I couldn't map it generically
                closestMatch = GetClosestMatch(charMove.toUpperCase(), characterMoves);
            }
            else{
                closestMatch = GetClosestMatch(MOVE_LIST[firstMoveMatchAttempt], characterMoves);
            }
            if(closestMatch === null) {return null;}
            return characterMoves[closestMatch];
        }
        else {
            actualMoveSelection = firstMoveMatchAttempt;
        }
        return actualMoveSelection;
    },

    AddUserField: AddUserField = (userID, fieldName, fieldValueToAdd, firebaseInstance) => {       
        return new Promise((resolve, reject) => {
            const user = firebaseInstance.ref(`users/${userID}`);
            user.once('value')
                .then((snapshot) => {
                    console.log('got the snapshot');
                    const key = snapshot.key;
                    console.log(`key is ${key} and value is value is ${snapshot.value}`);
                    user.update({[fieldName]: CheckIfJson(fieldValueToAdd) ? [fieldValueToAdd] : fieldValueToAdd})
                        .then(() => {resolve(true);})
                })
                .catch((err) => {console.log(err); reject(err);})
            console.log('done');
        });        
    },

    AddUser: AddUser = (userName, firebaseInstance) => {
        const users = firebaseInstance.ref('users');
        return new Promise((resolve, reject) => {
            users.once('value')
                .then((snapshot) => {
                    if(!snapshot.hasChild(userName)){ //user doesn't exist in the db yet
                        users.update({[userName]: {name: '', balance: 0, class: ''}})
                            .then(() => {
                                resolve(true);
                            })
                            .catch((err) => {console.log(err); reject(err); })
                    }
                    else{
                        resolve(false); //already exists
                    }
                })
                .catch((err) => {console.log(err); reject(err); })
        });        
    },

    CheckIfJson: CheckIfJson = (stringToTest) => {
        try {
            JSON.parse(stringToTest);
        }
        catch(ex){
            return false;
        }
        return true;
    },

    GetClosestMatch: GetClosestMatch = (jsonSearchKey, jArray) => {
        const fs = FuzzySet();
        for(let key in jArray){
            fs.add(key);
        }
        console.log(`searching for ${jsonSearchKey}`);
        if(jsonSearchKey === null){
            return null;
        }
        const results = fs.get(jsonSearchKey, null, .5);
        console.log(results);
        if(results === null){
            return null;
        }
        var resultTokens = results[0];
        console.log(`${resultTokens[1]} found with a score of ${resultTokens[0]}`);
        return resultTokens[1];
    }
}