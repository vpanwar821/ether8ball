var rn = require('random-number');
const logger = require('../utils/logger').logger;
const config = require('config');
var hexToDec = require('hex-to-dec');

import { encrypt,decrypt } from '../helpers/encryption';
import { randomNumberHex,mixGene,mixGenerationGene,randomNumber } from '../helpers/randomNumber';

class Gene {
    constructor(){
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


    cueRandomGene(){
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
        this.vipPoints = randomNumberHex(0,15,1);
        this.cashback = randomNumberHex(0,100,2);
        this.weight = randomNumberHex(17,21,2);
        this.material = randomNumberHex(1,10,1);
        this.multiplier = randomNumberHex(0,10,1);
        this.random = randomNumberHex(0,1048575,5);
        var gen = "0" + this.family + "0" + this.tip + "1" + this.shaft + "2" + this.shaftCollar + "3" + this.joint + "4" + this.forewrap + "5" + this.wrap + "6" + this.sleeve + "7" + this.buttCap 
                    + "8" + this.bumper + this.baseColor + this.complimentaryColor + this.spin + this.aim + this.strength + this.time + this.xpPoints + this.vipPoints
                    + this.cashback + this.weight + this.material + this.multiplier + this.random;
        var encryptedGene = encrypt(gen,config.password);
        return encryptedGene;
    }

    cueGene(gene){
        let decryptedGene = decrypt(gene,config.password);
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
        this.random = decryptedGene.substr(47,5);
        return decryptedGene;
    }

    reManufacture(gen1,gen2,gen3){
        var decryptedGene1 = decrypt(gen1,config.password);
        var decryptedGene2 = decrypt(gen2,config.password);
        var decryptedGene3 = decrypt(gen3,config.password);

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
        var randomGene1 = decryptedGene1.substr(47,5);

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
        var randomGene2 = decryptedGene2.substr(47,5);

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
        var randomGene3 = decryptedGene3.substr(47,5);

        this.generation = mixGenerationGene(generationGene1,generationGene2,generationGene3,multiplierGene1,multiplierGene2,multiplierGene3);
        this.family = mixGene(familyGene1,familyGene2,familyGene3);
        this.tip = mixGene(tipGene1,tipGene2,tipGene3);
        this.shaft = mixGene(shaftGene1,shaftGene2,shaftGene3);
        this.shaftCollar = mixGene(shaftCollarGene1,shaftCollarGene2,shaftCollarGene3);
        this.joint = mixGene(jointGene1,jointGene2,jointGene3);
        this.forewrap = mixGene(forewrapGene1,forewrapGene2,forewrapGene3);
        this.wrap = mixGene(wrapGene1,wrapGene2,wrapGene3);
        this.sleeve = mixGene(sleeveGene1,sleeveGene2,sleeveGene3);
        this.buttCap = mixGene(buttCapGene1,buttCapGene2,buttCapGene3);
        this.bumper = mixGene(bumperGene1,bumperGene2,bumperGene3);
        this.baseColor = mixGene(baseColorGene1,baseColorGene2,baseColorGene3);
        this.complimentaryColor = mixGene(complimentaryColorGene1,complimentaryColorGene2,complimentaryColorGene3);
        this.spin = mixGene(spinGene1,spinGene2,spinGene3);
        this.aim = mixGene(aimGene1,aimGene2,aimGene3);
        this.strength = mixGene(strengthGene1,strengthGene2,strengthGene3);
        this.time = mixGene(timeGene1,timeGene2,timeGene3);
        this.xpPoints = mixGene(xpPointsGene1,xpPointsGene2,xpPointsGene3);
        this.vipPoints = mixGene(vipPointsGene1,vipPointsGene2,vipPointsGene3);
        this.cashback = mixGene(cashbackGene1,cashbackGene2,cashbackGene3);
        this.weight = mixGene(weightGene1,weightGene2,weightGene3);
        this.material = mixGene(materialGene1,materialGene2,materialGene3);
        this.multiplier = mixGene(multiplierGene1,multiplierGene2,multiplierGene3);
        this.random = mixGene(randomGene1,randomGene2,randomGene3);

        var gen = this.generation + this.family + this.tip + this.shaft + this.shaftCollar + this.joint + this.forewrap + this.wrap + this.sleeve + this.buttCap 
                + this.bumper + this.baseColor + this.complimentaryColor + this.spin + this.aim + this.strength + this.time + this.xpPoints + this.vipPoints
                + this.cashback + this.weight + this.material + this.multiplier + this.random;
        var encryptedGene = encrypt(gen,config.password);
        return encryptedGene;
    }

}


module.exports = Gene;