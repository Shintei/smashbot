const characterData = require('.././data');
const Constants = require('.././Constants.js');
require('.././BotFunctions.js');
const fs = require('fs');

CreateCharacterData = (characterInit) => {
    const charData = characterInit;
    if(charData == null){
        return null;
    }
    const moveMappings = charData.moveMappings;
    if(moveMappings == null){
        return charData;
    }
    charData.prettyName = GetPrettifiedCharacterName(charData.name);
    MapCharacterSpecificMoves(charData, moveMappings);
    MapGenericAliases(charData);
    return charData;
}

MapCharacterSpecificMoves = (charData, charMoveMappings) => {
    let logicalName, key;
    for(let move in charData.moves){        
        if(charData.moves[move].ufdName == null && move in Constants.GENERIC_MOVE_ALIASES_UFD){
            //console.log('met the condition!')
            charData.moves[move].ufdName = `${Constants.GENERIC_MOVE_ALIASES_UFD[move]}.gif`
        }
    }
    
    charMoveMappings.forEach(
        moveMapping => {
            key = Object.keys(moveMapping)[0];
            logicalName = moveMapping[key];
            if(logicalName != null){
                charData.moves[key] = charData.moves[logicalName];
                if(charData.moves[key] == null){
                    console.log(`error for char ${charData.name} with move ${key}, logicalName is ${logicalName}`)
                    fs.appendFile('charMappingErrors.txt', `error with ${charData.name}'s ${logicalName}\n`, (err => {
                        if(err){ throw err;}
                    }))
                }
                charData.moves[key].Name = logicalName;                
            }            
        }
    );  
}

MapGenericAliases = (charData) => {
    let logicalName, key;
    Constants.INTERNAL_MOVE_ALIASES.forEach(
        alias => {            
            key = Object.keys(alias)[0];
            logicalName = alias[key];
            if(charData.moves[logicalName] == null) {
                return;
            }
            if(logicalName != null){
                charData.moves[key] = charData.moves[logicalName];
                charData.moves[key].Name = logicalName;
            }            
        }
    );  
}

module.exports = {
    get BANJO(){ return CreateCharacterData(characterData.BanjoAndKazooie) },
    get BANJOANDKAZOOIE(){ return this.BANJO },
    get BAYO(){ return CreateCharacterData(characterData.Bayonetta ) },
    get BAYONETTA(){ return this.BAYO },
    get DARYN() {return this.BAYO },
    get BOWSER(){ return CreateCharacterData(characterData.Bowser ) },
    get SERG(){ return this.BOWSER },
    get BOWSERJR(){ return CreateCharacterData(characterData.BowserJr ) },
    get BYLETH(){ return CreateCharacterData(characterData.Byleth ) },
    get CAPTAINFALCON(){ return CreateCharacterData(characterData.CaptainFalcon ) },
    get FALCON(){ return this.CAPTAINFALCON },
    get CHROM(){ return CreateCharacterData(characterData.Chrom ) },
    get CLOUD(){ return CreateCharacterData(characterData.Cloud ) },
    get CORRIN(){ return CreateCharacterData(characterData.Corrin ) },
    get DAISY(){ return CreateCharacterData(characterData.Daisy ) },
    get DARKPIT(){ return CreateCharacterData(characterData.DarkPit ) },
    get DARKSAMUS(){ return CreateCharacterData(characterData.DarkSamus ) },
    get DIDDYKONG(){ return CreateCharacterData(characterData.DiddyKong ) },
    get DIDDY(){ return this.DIDDYKONG },
    get DONKEYKONG(){ return CreateCharacterData(characterData.DonkeyKong ) },
    get DK(){ return this.DONKEYKONG },
    get DRMARIO(){ return CreateCharacterData(characterData.DrMario ) },
    get DOC() {return this.DRMARIO},
    get DUCKHUNT(){ return CreateCharacterData(characterData.DuckHunt ) },
    get DUCKHUNTDOG(){ return this.DUCKHUNT },
    get FALCO(){ return CreateCharacterData(characterData.Falco ) },
    get TOMMY(){ return this.FALCO },
    get SIRTHOMASGANON(){ return this.FALCO },
    get FOX(){ return CreateCharacterData(characterData.Fox ) },
    get GANONDORF(){ return CreateCharacterData(characterData.Ganondorf ) },
    get GANON(){ return this.GANONDORF },
    get GRENINJA(){ return CreateCharacterData(characterData.Greninja ) },
    get GREN() { return this.GRENINJA },
    get HERO(){ return CreateCharacterData(characterData.Hero ) },
    get ICECLIMBERS(){ return CreateCharacterData(characterData.IceClimbers ) },
    get IC() {return this.ICECLIMBERS },
    get ICs() {return this.ICECLIMBERS },
    get IKE() { return CreateCharacterData(characterData.Ike) },
    get INCINEROAR() { return CreateCharacterData(characterData.Incineroar) },
    get BRYAN(){ return this.INCINEROAR },
    get INKLING() { return CreateCharacterData(characterData.Inkling) },
    get ISABELLE() { return CreateCharacterData(characterData.Isabelle) },
    get JIGGLYPUFF() { return CreateCharacterData(characterData.Jigglypuff) },
    get JIGGS() {return this.JIGGLYPUFF},
    get PUFF(){ return this.JIGGLYPUFF},
    get JOKER() { return CreateCharacterData(characterData.Joker) },
    get ARSENE() { return CreateCharacterData(characterData.Arsene) },
    get KEN() { return CreateCharacterData(characterData.Ken) },
    get XAVIER() {return this.KEN},
    get KINGDEDEDE() { return CreateCharacterData(characterData.KingDedede) },
    get DDD() {return this.KINGDEDEDE},
    get D3() {return this.KINGDEDEDE},
    get DeDeDe() {return this.KINGDEDEDE},
    get KingDDD() {return this.KINGDEDEDE},
    get KINGKROOL() { return CreateCharacterData(characterData.KingKRool) },
    get KROOL() {return this.KINGKROOL},
    get KIRBY() { return CreateCharacterData(characterData.Kirby) },
    get LINK() { return CreateCharacterData(characterData.Link) },
    get DWAYNE(){ return this.LINK },
    get LITTLEMAC() { return CreateCharacterData(characterData.LittleMac) },
    get LILMAC() {return this.LITTLEMAC},
    get MAC() {return this.LITTLEMAC },
    get LUCARIO() { return CreateCharacterData(characterData.LittleMac) },
    get LUCAS() { return CreateCharacterData(characterData.Lucas) },
    get C(){ return this.LUCAS },
    get LUCINA() { return CreateCharacterData(characterData.Lucina) },
    get LUIGI() { return CreateCharacterData(characterData.Luigi) },
    get MARIO() { return CreateCharacterData(characterData.Mario) },
    get MARTH() { return CreateCharacterData(characterData.Marth) },
    get CHAZ() {return this.MARTH },
    get MEGAMAN(){ return CreateCharacterData(characterData.MegaMan ) },
    get METAKNIGHT(){ return CreateCharacterData(characterData.MetaKnight ) },
    get MK() { return this.METAKNIGHT },
    get MEWTWO() { return CreateCharacterData(characterData.Mewtwo ) },
    get MEW2(){ return this.MEWTWO},
    get MIDTIER() {return this.MEWTWO },
    get MIIBRAWLER() { return CreateCharacterData(characterData.MiiBrawler ) },
    get BRAWLER() {return this.MIIBRAWLER},
    get MIIGUNNER() { return CreateCharacterData(characterData.MiiGunner ) },
    get GUNNER() {return this.MIIGUNNER},
    get MIISWORDFIGHTER() { return CreateCharacterData(characterData.MiiSwordfighter ) },
    get SWORDFIGHTER(){ return this.MIISWORDFIGHTER},
    get MIISWORD(){ return this.MIISWORDFIGHTER },
    get MINMIN(){ return CreateCharacterData(characterData.MinMin ) },
    get MRGAMEANDWATCH(){ return CreateCharacterData(characterData.MrGameAndWatch ) },
    get GW(){ return this.MRGAMEANDWATCH},
    get GAMEANDWATCH() {return this.MRGAMEANDWATCH},
    get NESS(){ return CreateCharacterData(characterData.Ness ) },
    get OLIMAR(){ return CreateCharacterData(characterData.Olimar ) },
    get ZAPBRANNIGAN(){ return this.OLIMAR },
    get OLI(){ return this.OLIMAR },
    get PACMAN(){ return CreateCharacterData(characterData.Pacman ) },
    get PALUTENA(){ return CreateCharacterData(characterData.Palutena ) },
    get PALU(){ return this.PALUTENA},
    get PEACH(){ return CreateCharacterData(characterData.Peach ) },
    get PICHU(){ return CreateCharacterData(characterData.Pichu ) },
    get PIKACHU(){ return CreateCharacterData(characterData.Pikachu ) },
    get PIKA(){ return this.PIKACHU},
    get PIRANHAPLANT(){ return CreateCharacterData(characterData.PiranhaPlant ) },
    get PPLANT(){ return this.PIRANHAPLANT },
    get PIT(){ return CreateCharacterData(characterData.Pit ) },
    get SQUIRTLE(){ return CreateCharacterData(characterData.Squirtle ) },
    get IVYSAUR(){ return CreateCharacterData(characterData.Ivysaur ) },
    get CHARIZARD(){ return CreateCharacterData(characterData.Charizard ) },
    get RICHTER(){ return CreateCharacterData(characterData.Richter ) },
    get RIDLEY(){ return CreateCharacterData(characterData.Ridley ) },
    get ROB(){ return CreateCharacterData(characterData.Rob ) },
    get ROBIN(){ return CreateCharacterData(characterData.Robin ) },
    get ROSALINA(){ return CreateCharacterData(characterData.RosalinaAndLuma ) },
    get ROSA(){return this.ROSALINA},
    get ROY(){ return CreateCharacterData(characterData.Roy ) },
    get RYU(){ return CreateCharacterData(characterData.Ryu ) },
    get SAMUS(){ return CreateCharacterData(characterData.Samus ) },
    get BONESAW(){ return this.SAMUS },
    get ANTHONY(){ return this.SAMUS },
    get SHEIK(){ return CreateCharacterData(characterData.Sheik ) },
    get SHULK(){ return CreateCharacterData(characterData.Shulk ) },
    get SIMON(){ return CreateCharacterData(characterData.Simon ) },
    get DANNY(){ return this.SIMON },
    get SNAKE(){ return CreateCharacterData(characterData.Snake ) },
    get SONIC(){ return CreateCharacterData(characterData.Sonic ) },
    get TERRY(){ return CreateCharacterData(characterData.Terry ) },
    get TOONLINK(){ return CreateCharacterData(characterData.ToonLink ) },
    get TLINK() {return this.TOONLINK},
    get TINK() {return this.TOONLINK},
    get VILLAGER(){ return CreateCharacterData(characterData.Villager ) },
    get WARIO(){ return CreateCharacterData(characterData.Wario ) },
    get WIIFITTRAINER(){ return CreateCharacterData(characterData.WiiFitTrainer ) },
    get WIIFIT() {return this.WIIFITTRAINER},
    get WOLF(){ return CreateCharacterData(characterData.Wolf ) },
    get YOSHI(){ return CreateCharacterData(characterData.Yoshi ) },
    get YOUNGLINK(){ return CreateCharacterData(characterData.YoungLink ) },
    get YLINK(){ return this.YOUNGLINK},
    get YINK(){ return this.YOUNGLINK},
    get ZELDA(){ return CreateCharacterData(characterData.Zelda ) },
    get ZEROSUITSAMUS(){ return CreateCharacterData(characterData.ZeroSuitSamus ) },
    get ZSS() {return this.ZEROSUITSAMUS}
}