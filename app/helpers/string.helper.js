const autoBind = require('auto-bind')

class StringHelper {
    constructor() {
        autoBind(this);
    }
    async vowelCut(string){
        if (this.hasVowels(string)){
            if(string.length === 1){
                return ""
            } else {
                let characterArray = string.split("")
                return characterArray.map(character => {
                    if(/[aeiouyAEIOUY]/.test(character)){
                        character = ""
                    } else {return character}
                }).join("")
            }
        } else {return string}
    }

    async hasVowels(string){
        let word = string.toLowerCase();
        return /[aeiouy ]/.test(word);
    }

    async randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}
module.exports = StringHelper;
