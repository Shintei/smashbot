const characterData = require('.././data');

module.exports = {
    BANJO: characterData.BanjoAndKazooie,
    get BANJOANDKAZOOIE(){ return this.BANJO },
    BAYO: characterData.Bayonetta,
    get BAYONETTA(){ return this.BAYO },
}