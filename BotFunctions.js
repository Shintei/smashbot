const firebase = require('firebase/app');
require('fuzzyset');
require('firebase/database');
const characterMappings = require('./utils/characterMapper.js');
const characterData = require('./data');
const { prefix, frameDataApiBaseUrl, token, firebaseConfig, administratorIds } = require('./config.json');
const { ULTIMATE_CHARACTERS, MOVE_LIST, TOKEN_DIVIDERS } = require('./Constants.js');
const { MoveNotFoundError, FrameAdvantageNotFoundError } = require('./errors/CustomErrors')

RemoveDividerTokensFromArray = (arr) => {
    const returnArr = arr;
    returnArr.map((returnToken, index) => {
        for(entry in TOKEN_DIVIDERS){
            if(returnToken != null && returnToken[returnToken.length-1] === TOKEN_DIVIDERS[entry].closingToken 
                    && returnToken[0] === TOKEN_DIVIDERS[entry].openingToken){
                returnArr[index] = returnToken.substring(1, returnToken.length-1);
                return;
            }
            else{
                //console.log('not mapping this run')
            }
        }
    });
    return returnArr;
}

GetFrameAdvantageFromMove = (moveDetails) => {
    if(moveDetails.actualAdvantage != null){
        return moveDetails.actualAdvantage;
    }
    let advantage = moveDetails.Advantage;
    return advantage;
}

module.exports = {
    IsAdmin(userId){
        if(administratorIds == null){
            return true;            
        }
        return administratorIds.includes(userId);
    },

    GetParsedArguments(content, expectedArgumentLength) {
        return new Promise((resolve, reject) => {
            let args;
            const contentArray = content.split(' ').filter((val) => {return val != ''});
            if(contentArray.length < (expectedArgumentLength+1)){
                reject(`Expected a minimum of ${expectedArgumentLength} arguments but only received ${contentArray.length}`);
                return;
            }
            else if(contentArray.length > (expectedArgumentLength+1)){
                args = GetArgumentsForSpaceSeparatedValues(contentArray.slice(1));
                if(args == null || args.length != expectedArgumentLength){
                    reject('Invalid format');
                    return;
                }
            }
            else{ // else matching number of arguments have been supplied, use those
                args = contentArray.slice(1);
            }
            resolve(args);
        });    
    },

    GetPrettifiedCharacterName: GetPrettifiedCharacterName = (charName) => {
        return charName != null && charName.indexOf(' - ') != -1 ?
                charName.substring(charName.indexOf(' - ') + 3) : 
                charName;
    },

    GetCharacterData: GetCharacterData = () => {
        //console.log(characterData);
    },

    GetArgumentsForSpaceSeparatedValues: GetArgumentsForSpaceSeparatedValues = (arr) => {
        const returnArr = [];
        let strBuffer = '';
        const openingTokens = TOKEN_DIVIDERS.map((tokenDivider) => {return tokenDivider.openingToken});
        const closingTokens = TOKEN_DIVIDERS.map((tokenDivider) => {return tokenDivider.closingToken});
        arr.forEach(token => {
            //console.log(`starting processing for ${token} while strBuffer is currently ${strBuffer}`)
            if(token == null || token === ''){
                //do nothing 
                return;
            }

            let isClosingWithMatchingStrBufferOpening = false;
            for(entry in TOKEN_DIVIDERS){
                if(token[token.length-1] === TOKEN_DIVIDERS[entry].closingToken && strBuffer.startsWith(TOKEN_DIVIDERS[entry].openingToken)){
                    isClosingWithMatchingStrBufferOpening = true;
                }
            }
            if(isClosingWithMatchingStrBufferOpening){
                returnArr.push(`${strBuffer}${token}`);
                strBuffer = '';
            }
            //starts with an opening tag but doesn't end with one and the buffer is empty ie '(mrgame'; update the buffer and continue
            else if(openingTokens.includes(token[0]) && strBuffer === '' && 
                    token[token.length-1] != closingTokens[(openingTokens.indexOf(token[0]))]){ 
                strBuffer = token;
            }
            else if(openingTokens.includes(token[0]) && strBuffer != ''){
                //bad syntax, let's get outta here
                console.error('bad syntax!')
                return undefined;
            }
            else if(strBuffer != ''){
                strBuffer = `${strBuffer}${token}`;
            }
            else {
                returnArr.push(token);
                strBuffer = '';
            }
        });
        RemoveDividerTokensFromArray(returnArr);
        return returnArr;
    },

    GetCharacterMappings: GetCharacterMappings = (charName) => {
        return new Promise((resolve, reject) => {
            if(charName == null){
                reject('char name cant be null');
                return;
            }
            const closestMatch = GetClosestMatch(charName.toUpperCase(), characterMappings);
            if(closestMatch == null){
                reject(`couldnt find character match for ${charName}`);
                return;
            }
            const returnVal = characterMappings[closestMatch];
            resolve(returnVal);
        });
    },    

    GetCharacterPunishes: GetCharacterPunishes = (charName, charMove, charToPunishWith) => {
        return new Promise((resolve, reject) => {
            GetCharacterMoveData(charName, charMove)
            .then((returnObj) => {
                const actualMoveData = returnObj.moveDetails.payload;
                returnObj.targetPunishAdvantage = GetFrameAdvantageFromMove(actualMoveData);
                if(returnObj.targetPunishAdvantage == null){
                    console.log('move data is null');
                    console.log(`char name is ${returnObj.characterName} and searchKey is ${returnObj.moveDetails.searchKey}`);
                    reject(new FrameAdvantageNotFoundError(returnObj.characterName, returnObj.moveDetails.searchKey, 'no frame advantage on this move'));
                    return;
                }                
                resolve(returnObj);
            })
            .catch((err) => {
                console.error(err)
            })               
        }); 
    },

    GetCharacterMoveData: GetCharacterMoveData = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            const returnObj = {};
            if(charName == null){ reject('char name cant be null'); }
            GetCharacterMappings(charName)
            .then((character) => {
                if(character == null){ reject('couldnt find a character match'); }
                returnObj.movePrefix = character.movePrefix;
                returnObj.uriComponent = character.uriComponent;
                //console.log(character);
                returnObj.characterName = character.name;
                let actualCharMoveData = GetCharacterMoveFromCharacter(charMove, character);
                if(actualCharMoveData == null){
                    reject(new MoveNotFoundError(character.name, 'couldnt find the move'));
                    return;
                }
                returnObj.moveDetails = actualCharMoveData;
                resolve(returnObj);
            })
            .catch((err) => {
                console.error(err);
                throw(err);
            })
        })
    },    

    GetCharacterMoveVisualEndpoint: GetCharacterMoveVisualEndpoint = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            GetCharacterMoveData(charName, charMove)
            .then((returnObj) => {
                //first check if the move has the ufdName
                const actualMoveData = returnObj.moveDetails.payload;
                const ufdName = actualMoveData.ufdName;
                const movePrefix = actualMoveData.movePrefix == null ? returnObj.movePrefix : actualMoveData.movePrefix;
                const resultArr = [];
                if(ufdName != null){
                    const hasMultipleResults = Array.isArray(ufdName);
                    if(hasMultipleResults){
                        ufdName.forEach(moveName => {
                            resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${returnObj.uriComponent}/${movePrefix}${moveName}`);
                        });
                    }
                    else{
                        resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${returnObj.uriComponent}/${movePrefix}${ufdName}`);                        
                    }
                }
                returnObj.imageUrls = resultArr;
                resolve(returnObj);
            })
            .catch((err) => {
                console.error(err)
            })               
        });        
    },
/*
    GetCharacterMoveVisualEndpoint: GetCharacterMoveVisualEndpoint = (charName, charMove) => {
        return new Promise((resolve, reject) => {
            const returnObj = {};
            if(charName == null){ reject('char name cant be null'); }
            GetCharacterMappings(charName)
            .then((character) => {
                if(character == null){ reject('couldnt find a character match'); }
                //console.log(character);
                returnObj.characterName = character.name;
                let actualCharMoveData = GetCharacterMoveFromCharacter(charMove, character);
                if(actualCharMoveData == null){
                    reject(new MoveNotFoundError(character.name, 'couldnt find the move'));
                    return;
                }
                returnObj.moveDetails = actualCharMoveData;
                const charMoveNameKey = actualCharMoveData.searchKey;

                //first check if the move has the ufdName
                const ufdName = actualCharMoveData.payload.ufdName;
                const movePrefix = actualCharMoveData.payload.movePrefix == null ? character.movePrefix : actualCharMoveData.payload.movePrefix;
                const resultArr = [];
                if(ufdName != null){
                    const hasMultipleResults = Array.isArray(ufdName);
                    if(hasMultipleResults){
                        ufdName.forEach(moveName => {
                            resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${character.uriComponent}/${movePrefix}${moveName}`);
                        });
                    }
                    else{
                        resultArr.push(`${frameDataApiBaseUrl}/hitboxes/${character.uriComponent}/${movePrefix}${ufdName}`);                        
                    }                                        
                }
                returnObj.imageUrls = resultArr;
                resolve(returnObj);
            })
            .catch((err) => {
                console.error(err)
            })               
        });        
    },
*/
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
        //console.log(`searching for ${jsonSearchKey}`);
        if(jsonSearchKey === null){
            return null;
        }
        const results = fs.get(jsonSearchKey, null, .5);
        //console.log(results);
        if(results === null){
            return null;
        }
        const resultTokens = results[0];
        //console.log(`${resultTokens[1]} found with a score of ${resultTokens[0]}`);
        return resultTokens[1];
    },

    GetAdmins: GetAdmins = () => {
        return administratorIds;
    }
}
