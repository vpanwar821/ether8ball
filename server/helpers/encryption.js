
import crypto from 'crypto';
import md5 from 'md5';
const config = require('config');

function encrypt(text,password) {
    var cipher = crypto.createCipher(config.algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text,password){
    var decipher = crypto.createDecipher(config.algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}



export {
    encrypt,
    decrypt
}