const Discord = require('discord.js');
const Constants = require('.././Constants.js');
const { STATIC_IMAGE_ADDRESSES, STATIC_STRINGS } = require('../Constants.js');

module.exports = {
    GetMoveVisualEmbed: GetMoveVisualEmbed = (embedRequest) => {
        const timestamp = new Date().getTime();
        const characterName = embedRequest.characterName;
        //console.log(`char name is`);
        //console.log(characterName);
        const fieldArr = GetFieldsFromMoveDetails(embedRequest.moveDetails);
        //console.log('completed mapping, key value pair is ');
        //console.log(fieldArr);
        const logicalMoveName = embedRequest.moveDetails.payload.Name == null ? embedRequest.moveDetails.searchKey : embedRequest.moveDetails.payload.Name;
        const embed = new Discord.RichEmbed()
            .setColor(2368512)
            .setTitle(logicalMoveName)
            .setAuthor(characterName, STATIC_IMAGE_ADDRESSES.SMASHLOGO)
            .setTimestamp(timestamp)
            .setFooter(STATIC_STRINGS.EMBEDFOOTER)
            .setThumbnail(STATIC_IMAGE_ADDRESSES.FIUEMBLEM)
            //.setImage(embedRequest.imageUrls[0]);
        if(embedRequest.imageUrls != null && embedRequest.imageUrls.length > 0){
            embed.setImage(embedRequest.imageUrls[0]);
        }
        embed.fields = fieldArr;
        //embed.author = { name: "**(${characterName}**", icon_url: STATIC_IMAGE_ADDRESSES.SMASHLOGO };
        //console.log('embedRequest object is ');
        //console.log(embedRequest);
          return embed;
    },

    GetFieldsFromMoveDetails: GetFieldsFromMoveDetails = (moveDetails) => {        
        const fieldArr = [];
        Object.keys(moveDetails.payload)
        .forEach(function buildFields(key){
            if(key === '' || key === 'ufdName' || key === 'Name' || moveDetails.payload[key] === ''){
                return; 
            }
            else {
                const moveDetailsPayloadValue = moveDetails.payload[key];
                const isInLine = !(moveDetailsPayloadValue != null && moveDetailsPayloadValue.length > 15);
                fieldArr.push({
                    name: key,
                    value: moveDetailsPayloadValue,
                    inline: isInLine
                });             
            }               
        })
        return fieldArr;        
    }

    
}