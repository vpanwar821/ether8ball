const logger = require('../utils/logger').logger;
import { getCurrentPrice,bid } from '../services/auctionService';
import { web3,createRawTransactionAuction,createRawTransaction } from '../services/ethereumService';
import { encrypt,decrypt } from '../helpers/encryption';
var Auction = require("../models/auction");
var Cue = require("../models/cue");
var CueName = require("../models/cueName");
var User = require("../models/user");
const config = require('config');
var hexToDec = require('hex-to-dec');
import crypto from 'crypto';
import { BigNumber } from 'bignumber.js';

const bidCue = async(req,res,next) => {
    try{
        var contractAddress;
        if(config.TESTING == true){
            contractAddress = config.AUCTION_CONTRACT_ADDRESS_DEV;
        }
        else{
            contractAddress = config.AUCTION_CONTRACT_ADDRESS_PROD;
        }
        var cueId = req.body.cueId;
        // var user = await User.find({email:req.body.email});
        let currentPrice = await getCurrentPrice(cueId);
        console.log("currentPrice",currentPrice);
        const keys = {pubkey:config.COO_PUBLIC_KEY,privkey:config.COO_PRIVATE_KEY};
        // let keys = {pubkey:user.ETHAddress,privkey:user.ETHPrivKey};
        let bidTransfer = await bid(cueId);
        console.log("bid",bidTransfer);
        var rawTx = await createRawTransaction(bidTransfer,keys,contractAddress,(new BigNumber(currentPrice).times(new BigNumber(10).pow(18))).toNumber(),"vikaspanwar16@gmail.com",req.body.gas);
        logger.info("Raw transaction generated successfully for cue bidding");
        console.log(rawTx);    
    }
    catch(err){
        logger.error("Error in generating raw transaction for cue bidding",err);
        return res.status(403).send({
            status:"error",
            code:"403",
            message:"Error in generating raw transaction"
        });
    }
    try{
        web3.eth.sendSignedTransaction('0x' + rawTx.toString('hex'))
        .on('receipt',async(receipt) =>{
            console.log(receipt);
            await Auction.update({cueId:req.body.cueId},{$set:{auctionOpen:false}}); 
            return res.status(200).send({
                status:"success",
                code:"200",
                message:"Cue bid successful"
            });
        })
        .on('error',async(error) =>{
            logger.error("error in sending cue bidding transaction",error);
            return res.status(500).json({
                "status": "Failure",
                "code": 500,
                "message": "error in sending cue bidding transaction"
            });
        })
    }
    catch(err){
        logger.error("Error in bidding Cue",err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure"
        });
    }
}

module.exports = function(router){
    router.post('/bidCue',
        (req,res,next) => {
            next();
        },
        bidCue
    );
}