
import crypto from 'crypto';
import md5 from 'md5';

const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text, password) {
  console.log('encrypt');
  let iv = crypto.randomBytes(IV_LENGTH);
  const hash = md5(password);
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(hash), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, password) {
  let textParts = text.split(':');
  
  let iv = new Buffer(textParts.shift(), 'hex');
  let encryptedText = new Buffer(textParts.join(':'), 'hex');
  const hash = md5(password);
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(hash), iv);
  
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}


export {
    encrypt,
    decrypt
}