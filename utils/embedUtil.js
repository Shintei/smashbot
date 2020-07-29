const Discord = require('discord.js');
const Constants = require('.././Constants.js');
const { STATIC_IMAGE_ADDRESSES, STATIC_STRINGS } = require('../Constants.js');

module.exports = {
    GetMoveVisualEmbed: GetMoveVisualEmbed = (embedRequest) => {
        const timestamp = new Date().getTime();
        const characterName = embedRequest.characterName;
        console.log(`char name is`);
        console.log(characterName);
        const fieldArr = [];
        Object.keys(embedRequest.moveDetails.payload)
            .forEach(function buildFields(key){
                if(key === '' || embedRequest.moveDetails.payload[key] === ''){
                   return; 
                }   
                fieldArr.push({
                    name: key,
                    value: embedRequest.moveDetails.payload[key],
                    inline: true
                });             
            });
        //console.log('completed mapping, key value pair is ');
        //console.log(fieldArr);
        const embed = new Discord.RichEmbed()
            .setColor(2368512)
            .setTimestamp(timestamp)
            .setFooter(STATIC_STRINGS.EMBEDFOOTER)
            .setThumbnail(STATIC_IMAGE_ADDRESSES.FIUEMBLEM)
            //.setImage(embedRequest.imageUrls[0]);
        if(embedRequest.imageUrls != null && embedRequest.imageUrls.length > 0){
            embed.setImage(embedRequest.imageUrls[0]);
        }
        embed.fields = fieldArr;
        embed.author = { name: characterName, icon_url: STATIC_IMAGE_ADDRESSES.SMASHLOGO };
        console.log('embedRequest object is ');
        console.log(embedRequest);
          return embed;
    }
}