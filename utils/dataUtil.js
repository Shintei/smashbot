/*Not currently used, maybe one day*/ 
const MappedCharacters = require('./characterMapper.js');
const characterMappings = []; //You can't treat this globally. It'll be empty again on the next access to this js

AddInitializedCharactersToMap = (characters) => {
    if(characters == null){
        console.log('why are the chars null?!');
        return;
    }
    characters.forEach((character) => {
        characterMappings.push(character);
    })
}

module.exports = {
    InitializeData: InitializeData = (addToMap) => {
        const returnObj = {};
        const characters = InitializeCharacterData(addToMap);
        returnObj.charData = characters;
        if(addToMap === true){
            AddInitializedCharactersToMap(characters);
        }
        return returnObj;     
    },

    InitializeCharacterData: InitializeCharacterData = (wantToStoreObjects) => {
        let numErrors = 0;
        const localCharacterCache = [];
        Object.keys(MappedCharacters)
        .forEach(char => {
            try{
                const mappedCharacter = MappedCharacters[char];
                if(wantToStoreObjects === true){
                    localCharacterCache.push(mappedCharacter);
                }                
            }
            catch(err){
                console.log(`error is ${err}`);
                numErrors++;
            }
        });
        if(numErrors > 0){
            console.error(`Total errors: ${numErrors}`);
        }
        else{
            console.log('All characters have been properly mapped!');
        }
        return localCharacterCache;     
    },
}