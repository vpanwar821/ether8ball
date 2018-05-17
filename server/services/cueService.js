var fs = require('fs')
  , gm = require('gm');
var Enum = require('enum');
var uuidv4 = require('uuid/v4');
const config = require('config');
const logger = require('../utils/logger').logger;

import { encrypt,decrypt } from '../helpers/encryption';
import { getCueId } from './cueCoreService';

var cueFamily = new Enum(['Bronze','Silver','Gold','Platinum','Handcrafted']);

export var cueImage =  async(gene) => {
    return new Promise((resolve,reject) => {
        var decryptedGene = decrypt(gene,config.password);
        var generationGene = decryptedGene.substr(0,1);
        var familyGene = decryptedGene.substr(1,1);
        var tipGene = decryptedGene.substr(3,2);
        var shaftGene = decryptedGene.substr(6,2);
        var shaftCollarGene = decryptedGene.substr(9,2);
        var jointGene = decryptedGene.substr(12,2);
        var forewrapGene = decryptedGene.substr(15,2);
        var wrapGene = decryptedGene.substr(18,2);
        var sleeveGene = decryptedGene.substr(21,2);
        var buttCapGene = decryptedGene.substr(24,2);
        var bumperGene = decryptedGene.substr(27,2);
        var baseColorGene = decryptedGene.substr(29,2);
        var complimentaryColorGene = decryptedGene.substr(31,2);
        var spinGene = decryptedGene.substr(33,1);
        var aimGene = decryptedGene.substr(34,1);
        var strengthGene = decryptedGene.substr(35,1);
        var timeGene = decryptedGene.substr(36,1);
        var xpPointsGene = decryptedGene.substr(37,3);
        var vipPointsGene = decryptedGene.substr(40,1);
        var cashbackGene = decryptedGene.substr(41,2);
        var weightGene = decryptedGene.substr(43,2);
        var materialGene = decryptedGene.substr(45,1);
        var multiplierGene = decryptedGene.substr(46,1);
        var randomGene = decryptedGene.substr(47,5);

        var cueId = getCueId(gene);
        // var cueId = "90000";

        if(familyGene == 0){

            gm(__dirname+'/images/bronze/tip/'+tipGene+'.png').append(__dirname+'/images/bronze/shaft/'+shaftGene+'.png',
            __dirname+'/images/bronze/shaftcollar/'+shaftCollarGene+'.png',
            __dirname+'/images/bronze/joint/'+jointGene+'.png',
            __dirname+'/images/bronze/forewrap/'+forewrapGene+'.png',
            __dirname+'/images/bronze/wrap/'+wrapGene+'.png',
            __dirname+'/images/bronze/sleeve/'+sleeveGene+'.png',
            __dirname+'/images/bronze/buttcap/'+buttCapGene+'.png',
            __dirname+'/images/bronze/bumper/'+bumperGene+'.png',true)
            .geometry('900x768+0+0')
            .write(__dirname+'/images/cueimage/bronze/'+ cueId +'.png', function (err) {
                if (err) {
                    logger.error("Error in creating the bronze cue",err);     
                    return reject(err);
                }
                else {
                    logger.info("Successfully created the bronze cue.CueId",cueId);
                    let url = __dirname+'/images/cueimage/bronze/'+ cueId +'.png';
                    return resolve(url);
                }
            });
        }

        if(familyGene == 1){
            gm(__dirname+'/images/silver/tip/'+tipGene+'.png').append(__dirname+'/images/silver/shaft/'+shaftGene+'.png',
            __dirname+'/images/silver/shaftcollar/'+shaftCollarGene+'.png',
            __dirname+'/images/silver/joint/'+jointGene+'.png',
            __dirname+'/images/silver/forewrap/'+forewrapGene+'.png',
            __dirname+'/images/silver/wrap/'+wrapGene+'.png',
            __dirname+'/images/silver/sleeve/'+sleeveGene+'.png',
            __dirname+'/images/silver/buttcap/'+buttCapGene+'.png',
            __dirname+'/images/silver/bumper/'+bumperGene+'.png',true)
            .geometry('900x768+0+0')
            .write(__dirname+'/images/cueimage/silver/'+ cueId +'.png', function (err) {
                if (err) {
                    logger.error("Error in creating the silver cue",err);     
                    return reject(err);
                }
                else {
                    logger.info("Successfully created the silver cue.CueId",cueId);
                    let url = __dirname+'/images/cueimage/silver/'+ cueId +'.png';
                    return resolve(url);
                }
            });
        }

        if(familyGene == 2){
            gm(__dirname+'/images/gold/tip/'+tipGene+'.png').append(__dirname+'/images/gold/shaft/'+shaftGene+'.png',
            __dirname+'/images/gold/shaftcollar/'+shaftCollarGene+'.png',
            __dirname+'/images/gold/joint/'+jointGene+'.png',
            __dirname+'/images/gold/forewrap/'+forewrapGene+'.png',
            __dirname+'/images/gold/wrap/'+wrapGene+'.png',
            __dirname+'/images/gold/sleeve/'+sleeveGene+'.png',
            __dirname+'/images/gold/buttcap/'+buttCapGene+'.png',
            __dirname+'/images/gold/bumper/'+bumperGene+'.png',true)
            .geometry('900x768+0+0')
            .write(__dirname+'/images/cueimage/gold/'+ cueId +'.png', function (err) {
                if (err) {
                    logger.error("Error in creating the gold cue",err);     
                    return reject(err);
                }
                else {
                    logger.info("Successfully created the gold cue.CueId",cueId);
                    let url = __dirname+'/images/cueimage/gold/'+ cueId +'.png';
                    return resolve(url);
                }
            });
        }

        if(familyGene == 3){
            gm(__dirname+'/images/platinum/tip/'+tipGene+'.png').append(__dirname+'/images/platinum/shaft/'+shaftGene+'.png',
            __dirname+'/images/platinum/shaftcollar/'+shaftCollarGene+'.png',
            __dirname+'/images/platinum/joint/'+jointGene+'.png',
            __dirname+'/images/platinum/forewrap/'+forewrapGene+'.png',
            __dirname+'/images/platinum/wrap/'+wrapGene+'.png',
            __dirname+'/images/platinum/sleeve/'+sleeveGene+'.png',
            __dirname+'/images/platinum/buttcap/'+buttCapGene+'.png',
            __dirname+'/images/platinum/bumper/'+bumperGene+'.png',true)
            .geometry('900x768+0+0')
            .write(__dirname+'/images/cueimage/platinum/'+ cueId +'.png', function (err) {
                if (err) {
                    logger.error("Error in creating the platinum cue",err);     
                    return reject(err);
                }
                else {
                    logger.info("Successfully created the platinum cue.CueId",cueId);
                    let url = __dirname+'/images/cueimage/platinum/'+ cueId +'.png';
                    return resolve(url);
                }
            });
        }

        if(familyGene == 4){
            gm(__dirname+'/images/handcrafted/tip/'+tipGene+'.png').append(__dirname+'/images/handcrafted/shaft/'+shaftGene+'.png',
            __dirname+'/images/handcrafted/shaftcollar/'+shaftCollarGene+'.png',
            __dirname+'/images/handcrafted/joint/'+jointGene+'.png',
            __dirname+'/images/handcrafted/forewrap/'+forewrapGene+'.png',
            __dirname+'/images/handcrafted/wrap/'+wrapGene+'.png',
            __dirname+'/images/handcrafted/sleeve/'+sleeveGene+'.png',
            __dirname+'/images/handcrafted/buttcap/'+buttCapGene+'.png',
            __dirname+'/images/handcrafted/bumper/'+bumperGene+'.png',true)
            .geometry('900x768+0+0')
            .write(__dirname+'/images/cueimage/handcrafted/'+ cueId +'.png', function (err) {
                if (err) {
                    logger.error("Error in creating the handcrafted cue",err);     
                    return reject(err);
                }
                else {
                    logger.info("Successfully created the handcrafted cue.CueId",cueId);
                    let url = __dirname+'/images/cueimage/handcrafted/'+ cueId +'.png';
                    return resolve(url);
                }
            });
        }
    });
};
