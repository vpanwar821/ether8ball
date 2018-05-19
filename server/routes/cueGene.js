const logger = require('../utils/logger').logger;
import { cueImage } from '../services/cueService';
import { getCueId,getGene,generateCueId } from '../services/cueCoreService';
import { web3,createRawTransaction } from '../services/ethereumService';
import { encrypt,decrypt } from '../helpers/encryption';
var Gene = require('../services/Gene');
var Auction = require("../models/auction");
var Cue = require("../models/cue");
var CueName = require("../models/cueName");
var gene = new Gene();
const config = require('config');
var hexToDec = require('hex-to-dec');
import crypto from 'crypto';

const createGene = async(req,res,next) => {
    try{
        var userGene = req.body.gen; 
        logger.info("Generation of gene",userGene);
        let result = gene.cueGene(userGene);
        return res.status(200).send({
            status:"success",
            code:"200",
            message:"Success",
            data:result
        });
    }
    catch(err){
        logger.error(err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

const createRandomGene = async(req,res,next) => {
    try{
        var contractAddress;
        if(config.TESTING == true){
            contractAddress = config.CUE_CONTRACT_ADDRESS_DEV;
        }
        else{
            contractAddress = config.CUE_CONTRACT_ADDRESS_PROD;
        }
        logger.info("Generation of random gene");
        var result = gene.cueRandomGene();
        // var result = "1008703d8d6796f51ffc446e6cf3d09064ab10fa9b83281038084bcb892d4414ffc86afe7374221b8b9252e2e384df64585fe172cc";
        const keys = {pubkey:config.COO_PUBLIC_KEY,privkey:config.COO_PRIVATE_KEY};
        console.log(keys);
        const generateCue = await generateCueId(result);
        console.log(generateCue);
        var rawTx = await createRawTransaction(generateCue,keys,contractAddress,0,"vikaspanwar16@gmail.com",req.body.gas);
        logger.info("Raw transaction generated successfully");
        }
    catch(err){
        logger.error("Error in generating raw transaction");
        return res.status(403).send({
            status:"error",
            code:"403",
            message:"error in creating raw transaction"
        });
    }
    try{
        web3.eth.sendSignedTransaction('0x' + rawTx.toString('hex'))
        .on('receipt',async(receipt)=>{
            var data = receipt.logs[1].data;
            var cueId = hexToDec((receipt.logs[1].data).substr((data.length-10),data.length));
            let count = await Auction.count({});
            var auction = new Auction({
                tmpId:count + 1,
                cueId:cueId,
                auctionOpen:true
            });

            auction.save(function(err) {
                if (err) {
                    logger.error("Error in adding to auction");
                    return res.status(403).send({
                        status:"error",
                        code:"403",
                        message:"Error in adding to auction",
                    });
                }
            });

            let decryptedGene = decrypt(result,config.password);
            var generation = decryptedGene.substr(0,1);
            var family = decryptedGene.substr(1,1);
            var tip = decryptedGene.substr(2,3);
            var shaft = decryptedGene.substr(5,3);
            var shaftCollar = decryptedGene.substr(8,3);
            var joint = decryptedGene.substr(11,3);
            var forewrap = decryptedGene.substr(14,3);
            var wrap = decryptedGene.substr(17,3);
            var sleeve = decryptedGene.substr(20,3);
            var buttCap = decryptedGene.substr(23,3);
            var bumper = decryptedGene.substr(26,3);
            var baseColor = decryptedGene.substr(29,2);
            var complimentaryColor = decryptedGene.substr(31,2);
            var spin = decryptedGene.substr(33,1);
            var aim = decryptedGene.substr(34,1);
            var strength = decryptedGene.substr(35,1);
            var time = decryptedGene.substr(36,1);
            var xpPoints = decryptedGene.substr(37,3);
            var vipPoints = decryptedGene.substr(40,1);
            var cashback = decryptedGene.substr(41,2);
            var weight = decryptedGene.substr(43,2);
            var material = decryptedGene.substr(45,1);
            var multiplier = decryptedGene.substr(46,1);
            if( family == 0){
                var familyName = "bronze";
                var tipName = await CueName.find({sequence:tip,family:"bronze"});
                var shaftName = await CueName.find({sequence:shaft,family:"bronze"})
                var shaftCollarName = await CueName.find({sequence:shaftCollar,family:"bronze"})
                var jointName = await CueName.find({sequence:joint,family:"bronze"})
                var forewrapName = await CueName.find({sequence:forewrap,family:"bronze"})
                var wrapName = await CueName.find({sequence:wrap,family:"bronze"})
                var sleeveName = await CueName.find({sequence:sleeve,family:"bronze"})
                var buttCapName = await CueName.find({sequence:buttCap,family:"bronze"})
                var bumperName = await CueName.find({sequence:bumper,family:"bronze"})
            }
            else if( family == 1){
                var familyName = "silver";
                var tipName = await CueName.find({sequence:tip,family:"silver"});
                var shaftName = await CueName.find({sequence:shaft,family:"silver"})
                var shaftCollarName = await CueName.find({sequence:shaftCollar,family:"silver"})
                var jointName = await CueName.find({sequence:joint,family:"silver"})
                var forewrapName = await CueName.find({sequence:forewrap,family:"silver"})
                var wrapName = await CueName.find({sequence:wrap,family:"silver"})
                var sleeveName = await CueName.find({sequence:sleeve,family:"silver"})
                var buttCapName = await CueName.find({sequence:buttCap,family:"silver"})
                var bumperName = await CueName.find({sequence:bumper,family:"silver"})
            }
            else if( family == 2){
                var familyName = "gold";
                var tipName = await CueName.find({sequence:tip,family:"gold"});
                var shaftName = await CueName.find({sequence:shaft,family:"gold"})
                var shaftCollarName = await CueName.find({sequence:shaftCollar,family:"gold"})
                var jointName = await CueName.find({sequence:joint,family:"gold"})
                var forewrapName = await CueName.find({sequence:forewrap,family:"gold"})
                var wrapName = await CueName.find({sequence:wrap,family:"gold"})
                var sleeveName = await CueName.find({sequence:sleeve,family:"gold"})
                var buttCapName = await CueName.find({sequence:buttCap,family:"gold"})
                var bumperName = await CueName.find({sequence:bumper,family:"gold"})
            }
            else if( family == 3){
                var familyName = "platinum";
                var tipName = await CueName.find({sequence:tip,family:"platinum"});
                var shaftName = await CueName.find({sequence:shaft,family:"platinum"})
                var shaftCollarName = await CueName.find({sequence:shaftCollar,family:"platinum"})
                var jointName = await CueName.find({sequence:joint,family:"platinum"})
                var forewrapName = await CueName.find({sequence:forewrap,family:"platinum"})
                var wrapName = await CueName.find({sequence:wrap,family:"platinum"})
                var sleeveName = await CueName.find({sequence:sleeve,family:"platinum"})
                var buttCapName = await CueName.find({sequence:buttCap,family:"platinum"})
                var bumperName = await CueName.find({sequence:bumper,family:"platinum"})
            }
            else if( family == 4){
                var familyName = "handcrafted";
                var tipName = await CueName.find({sequence:tip,family:"handcrafted"});
                var shaftName = await CueName.find({sequence:shaft,family:"handcrafted"})
                var shaftCollarName = await CueName.find({sequence:shaftCollar,family:"handcrafted"})
                var jointName = await CueName.find({sequence:joint,family:"handcrafted"})
                var forewrapName = await CueName.find({sequence:forewrap,family:"handcrafted"})
                var wrapName = await CueName.find({sequence:wrap,family:"handcrafted"})
                var sleeveName = await CueName.find({sequence:sleeve,family:"handcrafted"})
                var buttCapName = await CueName.find({sequence:buttCap,family:"handcrafted"})
                var bumperName = await CueName.find({sequence:bumper,family:"handcrafted"})
            }
            let cueCount = await Cue.count({});
            let imageUrl = await cueImage(cueId);
            var cueGene = new Cue({
                tmpId:cueCount+1,
                cueId:cueId,
                family:familyName,
                tip:tipName[0].name,
                shaft:shaftName[0].name,
                shaftCollar:shaftCollarName[0].name,
                joint:jointName[0].name,
                forewrap:forewrapName[0].name,
                wrap:wrapName[0].name,
                sleeve:sleeveName[0].name,
                buttcap:buttCapName[0].name,
                bumper:bumperName[0].name,
                imageUrl:imageUrl
            });
            cueGene.save(function(err) {
                if (err) {
                    logger.error("Error in adding to cue");
                    return res.status(403).send({
                        status:"error",
                        code:"403",
                        message:"Error in adding to cue",
                    });
                }
                else {
                    return res.status(200).send({
                        status:"success",
                        code:"200",
                        message:"Gene generated"
                    });
                }
            });    
        })
        .on('error',async(error) =>{
            logger.error("error in sending gen0 cue transaction",error);
            return res.status(500).json({
                "status": "Failure",
                "code": 500,
                "message": "error in sending gen0 cue transaction"
            });
        })
        
    }
    catch(err){
        logger.error(err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

const geneRemanufacture = async(req,res,next) => {
    try{
        let gen1 = req.body.gene1;
        let gen2 = req.body.gene2;
        let gen3 = req.body.gene3;
        logger.info("Remanufacturing of genes");
        logger.info("gene1",gen1);
        logger.info("gene2",gen2);
        logger.info("gene3",gen3);
        let result = gene.reManufacture(gen1,gen2,gen3);
        return res.status(200).send({
            status:"success",
            code:"200",
            data:result
        });
    }
    catch(err){
        logger.error("Error in remanufacturing",err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

const cueGeneration = async(req,res,next) => {
    try{
        let gene = req.body.gene;
        let result = await cueImage(gene);
        return res.status(200).send({
            status:"success",
            code:"200",
            data:result
        });
    }
    catch(err){
        logger.error("Error in remanufacturing",err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure"
        });
    }
}

const encryption = async(req,res,next) => {
    try{
        let text = req.body.text;
        let password = req.body.password;
        let result = await encryptnew(text,password);
        return res.status(200).send({
            status:"success",
            code:"200",
            data:result
        });
    }
    catch(err){
        logger.error("Error in remanufacturing",err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure"
        });
    }
}

function encryptnew(text,password) {
    var cipher = crypto.createCipher(config.algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

module.exports = function(router){
    router.post('/createGene',
        (req,res,next) => {
            next();            
        },
        createGene
    );

    router.get('/createRandomGene',
        (req,res,next) => {
            next();            
        },
        createRandomGene
    );

    router.post('/remanufacture',
        (req,res,next) => {
            next();
        },
        geneRemanufacture
    );

    router.post('/cueImage',
        (req,res,next) => {
            next();
        },
        cueGeneration
    );

    router.post('/encrypt',
        (req,res,next) => {
            next();
        },
        encryption
    );
}