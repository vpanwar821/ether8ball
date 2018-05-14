var crypto = require('crypto');
const config = require('config');

function encrypt(text) {
    var cipher = crypto.createCipher(config.algorithm,config.password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(config.algorithm,config.password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {encrypt,decrypt}