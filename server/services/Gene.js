var rn = require('random-number');
const logger = require('../utils/logger');
const config = require('config');
var crypto = require('crypto');
var hexToDec = require('hex-to-dec');
//default constructor
function Gene(){
    this.generation = 0;
    this.family = 0;
    this.tip = 111;
    this.shaft = 101;
    this.shaftCollar = 201;
    this.joint = 301;
    this.forewrap = 401;
    this.wrap = 501;
    this.sleeve = 601;
    this.buttCap = 701;
    this.bumper = 801;
    this.baseColor = 11;
    this.complimentaryColor = 11;
    this.spin = 1;
    this.aim = 1;
    this.strength = 1;
    this.time = 1;
    this.xpPoints = 222;
    this.vipPoints = 0;
    this.cashback = 10;
    this.weight = 11;
    this.material = 1;
    this.multiplier = 1;
    this.random = 12345;
}


Gene.prototype.cueRandomGene = function(){
    this.generation = randomNumberHex(0,10,1);
    this.family = randomNumberHex(0,4,1);
    this.tip = randomNumberHex(1,30,2);
    this.shaft = randomNumberHex(1,30,2);
    this.shaftCollar = randomNumberHex(1,30,2);
    this.joint = randomNumberHex(1,30,2);
    this.forewrap = randomNumberHex(1,30,2);
    this.wrap = randomNumberHex(1,30,2);
    this.sleeve = randomNumberHex(1,30,2);
    this.buttCap = randomNumberHex(1,30,2);
    this.bumper = randomNumberHex(1,30,2);
    this.baseColor = randomNumberHex(1,60,2);
    this.complimentaryColor = randomNumberHex(1,60,2);
    this.spin = randomNumberHex(1,8,1);
    this.aim = randomNumberHex(1,8,1);
    this.strength = randomNumberHex(1,8,1);
    this.time = randomNumberHex(1,8,1);
    this.xpPoints = randomNumberHex(0,1000,3);
    this.vipPoints = randomNumberHex(0,16,1);
    this.cashback = randomNumberHex(0,100,2);
    this.weight = randomNumberHex(17,21,2);
    this.material = randomNumberHex(1,10,1);
    this.multiplier = randomNumberHex(0,10,1);
    this.random = randomNumberHex(0,1048575,5);
    var gen = this.generation + this.family + "0" + this.tip + "1" + this.shaft + "2" + this.shaftCollar + "3" + this.joint + "4" + this.forewrap + "5" + this.wrap + "6" + this.sleeve + "7" + this.buttCap 
                + "8" + this.bumper + this.baseColor + this.complimentaryColor + this.spin + this.aim + this.strength + this.time + this.xpPoints + this.vipPoints
                + this.cashback + this.weight + this.material + this.multiplier + this.random;
    var encryptedGene = encrypt(gen);
    return encryptedGene;
}

Gene.prototype.cueGene = function(gene){
    let decryptedGene = decrypt(gene);
    this.generation = decryptedGene.substr(0,1);
    this.family = decryptedGene.substr(1,1);
    this.tip = decryptedGene.substr(2,3);
    this.shaft = decryptedGene.substr(5,3);
    this.shaftCollar = decryptedGene.substr(8,3);
    this.joint = decryptedGene.substr(11,3);
    this.forewrap = decryptedGene.substr(14,3);
    this.wrap = decryptedGene.substr(17,3);
    this.sleeve = decryptedGene.substr(20,3);
    this.buttCap = decryptedGene.substr(23,3);
    this.bumper = decryptedGene.substr(26,3);
    this.baseColor = decryptedGene.substr(29,2);
    this.complimentaryColor = decryptedGene.substr(31,2);
    this.spin = decryptedGene.substr(33,1);
    this.aim = decryptedGene.substr(34,1);
    this.strength = decryptedGene.substr(35,1);
    this.time = decryptedGene.substr(36,1);
    this.xpPoints = decryptedGene.substr(37,3);
    this.vipPoints = decryptedGene.substr(40,1);
    this.cashback = decryptedGene.substr(41,2);
    this.weight = decryptedGene.substr(43,2);
    this.material = decryptedGene.substr(45,1);
    this.multiplier = decryptedGene.substr(46,1);
    this.randomNumber = decryptedGene.substr(47,5);
    return decryptedGene;
}

Gene.prototype.reManufacture = function(gen1,gen2,gen3){
    var decryptedGene1 = decrypt(gen1);
    var decryptedGene2 = decrypt(gen2);
    var decryptedGene3 = decrypt(gen3);

    //splitting of first cue
    var generationGene1 = decryptedGene1.substr(0,1);
    var familyGene1 = decryptedGene1.substr(1,1);
    var tipGene1 = decryptedGene1.substr(2,3);
    var shaftGene1 = decryptedGene1.substr(5,3);
    var shaftCollarGene1 = decryptedGene1.substr(8,3);
    var jointGene1 = decryptedGene1.substr(11,3);
    var forewrapGene1 = decryptedGene1.substr(14,3);
    var wrapGene1 = decryptedGene1.substr(17,3);
    var sleeveGene1 = decryptedGene1.substr(20,3);
    var buttCapGene1 = decryptedGene1.substr(23,3);
    var bumperGene1 = decryptedGene1.substr(26,3);
    var baseColorGene1 = decryptedGene1.substr(29,2);
    var complimentaryColorGene1 = decryptedGene1.substr(31,2);
    var spinGene1 = decryptedGene1.substr(33,1);
    var aimGene1 = decryptedGene1.substr(34,1);
    var strengthGene1 = decryptedGene1.substr(35,1);
    var timeGene1 = decryptedGene1.substr(36,1);
    var xpPointsGene1 = decryptedGene1.substr(37,3);
    var vipPointsGene1 = decryptedGene1.substr(40,1);
    var cashbackGene1 = decryptedGene1.substr(41,2);
    var weightGene1 = decryptedGene1.substr(43,2);
    var materialGene1 = decryptedGene1.substr(45,1);
    var multiplierGene1 = decryptedGene1.substr(46,1);
    var randomNumberGene1 = decryptedGene1.substr(47,5);

    //splitting of second cue
    var generationGene2 = decryptedGene2.substr(0,1);
    var familyGene2 = decryptedGene2.substr(1,1);
    var tipGene2 = decryptedGene2.substr(2,3);
    var shaftGene2 = decryptedGene2.substr(5,3);
    var shaftCollarGene2 = decryptedGene2.substr(8,3);
    var jointGene2 = decryptedGene2.substr(11,3);
    var forewrapGene2 = decryptedGene2.substr(14,3);
    var wrapGene2 = decryptedGene2.substr(17,3);
    var sleeveGene2 = decryptedGene2.substr(20,3);
    var buttCapGene2 = decryptedGene2.substr(23,3);
    var bumperGene2 = decryptedGene2.substr(26,3);
    var baseColorGene2 = decryptedGene2.substr(29,2);
    var complimentaryColorGene2 = decryptedGene2.substr(31,2);
    var spinGene2 = decryptedGene2.substr(33,1);
    var aimGene2 = decryptedGene2.substr(34,1);
    var strengthGene2 = decryptedGene2.substr(35,1);
    var timeGene2 = decryptedGene2.substr(36,1);
    var xpPointsGene2 = decryptedGene2.substr(37,3);
    var vipPointsGene2 = decryptedGene2.substr(40,1);
    var cashbackGene2 = decryptedGene2.substr(41,2);
    var weightGene2 = decryptedGene2.substr(43,2);
    var materialGene2 = decryptedGene2.substr(45,1);
    var multiplierGene2 = decryptedGene2.substr(46,1);
    var randomNumberGene2 = decryptedGene2.substr(47,5);

    //splitting of third cue
    var generationGene3 = decryptedGene3.substr(0,1);
    var familyGene3 = decryptedGene3.substr(1,1);
    var tipGene3 = decryptedGene3.substr(2,3);
    var shaftGene3 = decryptedGene3.substr(5,3);
    var shaftCollarGene3 = decryptedGene3.substr(8,3);
    var jointGene3 = decryptedGene3.substr(11,3);
    var forewrapGene3 = decryptedGene3.substr(14,3);
    var wrapGene3 = decryptedGene3.substr(17,3);
    var sleeveGene3 = decryptedGene3.substr(20,3);
    var buttCapGene3 = decryptedGene3.substr(23,3);
    var bumperGene3 = decryptedGene3.substr(26,3);
    var baseColorGene3 = decryptedGene3.substr(29,2);
    var complimentaryColorGene3 = decryptedGene3.substr(31,2);
    var spinGene3 = decryptedGene3.substr(33,1);
    var aimGene3 = decryptedGene3.substr(34,1);
    var strengthGene3 = decryptedGene3.substr(35,1);
    var timeGene3 = decryptedGene3.substr(36,1);
    var xpPointsGene3 = decryptedGene3.substr(37,3);
    var vipPointsGene3 = decryptedGene3.substr(40,1);
    var cashbackGene3 = decryptedGene3.substr(41,2);
    var weightGene3 = decryptedGene3.substr(43,2);
    var materialGene3 = decryptedGene3.substr(45,1);
    var multiplierGene3 = decryptedGene3.substr(46,1);
    var randomNumberGene3 = decryptedGene3.substr(47,5);

    this.generation = hexToDec(generationGene1,generationGene2,generationGene3);
}

function randomNumberHex(minNum,maxNum,value){
    var ranGen = rn.generator({
        min:  minNum,
        max:  maxNum,
        integer: true
    });
    var temp = ranGen();
    var ran = temp.toString(16).toUpperCase();
    if(ran.length < value){
        var diff =  value - ran.length;
        for(var i = 0; i < diff; i++)
        {
            ran = "0" + ran;
        } 
    }
    return ran;
}

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

function hexaToDecimal(num1,num2,num3){
   num1 = hexToDec(num1);
   num2 = hexToDec(num2);
   num3 = hexToDec(num3);
}

module.exports = Gene;