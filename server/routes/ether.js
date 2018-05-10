const logger = require('../utils/logger').logger;
const ethers = require('ethers');
const config = require('config');
import {encrypt} from '../helpers/encryption';
import rp from 'request-promise';
import { createRawTransaction, sendTransaction, web3, balanceOfToken, transferToken, createRawTransactionAdmin } from '../services/ethereumService.js';
import BigNumber from 'bignumber.js';
// import { completeTxMail, cancelTxMail} from '../services/mail';
var User = require("../models/user");
const apiKey = config.ETHERSCAN_API_KEY;
const end_of_url = `&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
let start_of_url;
if(config.TESTING === true){
    start_of_url = config.ETHERSCAN_API_URL_DEV;
}
else{
    start_of_url = config.ETHERSCAN_API_URL_PROD;
}

const getEtherAddress = async(req,res,async) => {
    if(req.params.email){
        logger.info("Ether address generated for user:"+req.params.email);
        let wallet = new ethers.Wallet.createRandom();
        let password = req.params.email + config.SECRET_KEY;
        let privateKey = encrypt(wallet.privateKey,password);
        let myquery = {email:req.params.email};
        let myvalue = {$set:{ETHAddress:wallet.address,ETHPrivKey:privateKey}};
        await User.update(myquery,myvalue);

        return res.status(200).json({
            "status":"success",
            "code":200,
            "messages":"Success",
            "data":{
                "publicKey":wallet.address,
                }
        });
    }
    else{
        logger.error("Error in getting email in getEtheraddress");
        return res.status(500).json({
            "status":"error",
            "code":500,
            "message":"Error" 
        });
    }
}

const etherTransactionHistory = async(req,res,next) => {

    if (!req.params.address) {
      return res.json({
        "status": "Failure",
        "code": 400,
        "message": "Missing parameters",
      })
    }
    const ethAddress = req.params.address;
    // ETHERSCAN
    let apiUrl = start_of_url + ethAddress + end_of_url;
  
    rp(apiUrl)
        .then(json => {
            const transactionHistory = JSON.parse(json).result;
            return res.status(200).json({
                "transactions": transactionHistory
            });
        }).catch(e => {
          logger.error('error in getting in ether transaction history',e);
            return res.status(500).send({
                "status": "Failure",
                "code": 500,
                "message": "Error: Transaction History",
            });
        });
  
  }
  
  
const etherTransactionHash = async(req,res,next) => {
  
        if (!req.params.hash) {
            return res.json({
                "status": "Failure",
                "code": 400,
                "message": "Missing parameters",
            })
        }
        let hash = req.params.hash;
        let apiUrl;
        // ETHERSCAN
        if(config.TESTING == true)
        {
            apiUrl = `https://ropsten.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`;
        }
        else{
            apiUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`;
        }
  
        rp(apiUrl)
            .then(json => {
                const transactionHistory = JSON.parse(json).result;
                logger.info("ether transaction from hash:",transactionHistory);
                return res.status(200).json({
                    "transactions": transactionHistory
                });
        }).catch(e => {
                logger.error("error in ether transaction hash:",e);
                return res.status(500).send({
                    "status": "Failure",
                    "code": 500,
                    "message": "Error: Transaction History",
                });
        });
  
}
  
  
const getEtherBalance = async(req, res, next) => {

    try{
        if (req.params.address==undefined) {
            return res.status(400).send({
                "status": "Failure",
                "code": 400,
                "message": "Missing parameters",
            })
        }
        logger.info("Ether balance generated for address:"+req.params.address);
        let balance = await web3.eth.getBalance(req.params.address);
            
        var newBalance = new BigNumber(balance);
        var etherString = newBalance.dividedBy(new BigNumber(10).pow(18)).toNumber();
            console.log(etherString);
        if(etherString <= 0.000861)
        {
            return res.status(200).send({
                    status:"success",
                    code:200,
                    data:{ 
                    "balance" : 0
                    }
                });
        }
        else
        {
            return res.status(200).send({
                    status:"success",
                    code:200,
                    data:{ 
                    "balance" : etherString
                    }
                });
        }
    }
    catch(error){
        logger.error("Error in getting ether balance",error);
        return res.status(403).send({
            "status": "Failure",
            "code": 403,
            "message": "Error in getting ether balance",
        })
    }
}
  
 
const transferEther = async(req,res,next) => {
    var coin = 'ETH';
    let rawTx;
    var rawTxComm;
    let myquery;
    let myvalue;
    let centralEtherAddress;
    var password = req.body.email + config.SECRET_KEY;
    var etherAmount = (req.body.value)- 0.000861;
   
    logger.info("Entered into the transfer ether for user:"+req.body.email);
    try{
    
         let user = await User.findOne({"email":req.body.email});
        const keys = { pubkey: user.ETHAddress, privkey: user.ETHPrivKey };
        rawTx = await createRawTransaction('', keys, req.body.ethereumAddress, (new BigNumber(etherAmount).times(new BigNumber(10).pow(18))).toNumber(), password, req.body.gas);
        logger.info("Raw transaction generated successfully");
    }
    catch(e){
        logger.error("error in creating the transaction for transfer ether:",e);
        return res.status(403).json({
            "status": "Failure",
            "code": 403,
            "message": "Error in creating the transaction check parameters.",
        });
    }
    try{
        web3.eth.sendSignedTransaction('0x' + rawTx.toString('hex'))
        .on('receipt', async (receipt) =>{
            let user = await User.findOne({"email":req.body.email});
            logger.info("Ether transferred successfully");
            // let mail = await completeTxMail(user.email,coin);
            return res.status(200).send({
                "status":"success",
                "code":200,
                "message":"Ether successfully transferred"
            });
        })
        .on('error',async (error) => {
            logger.error("error in transferring ether:",error);
            // await cancelTxMail(req.body.email, coin);
            return res.status(500).json({
                "status": "Failure",
                "code": 500,
                "message": "Error in transferring Ether",
            });
        })
        
    }
    catch(e) {
      logger.error("error in transferring ether:",e);
    //   await cancelTxMail(req.body.email, coin);
      return res.status(500).json({
        "status": "Failure",
        "code": 500,
        "message": "Error in transferring Ether",
      });
    }
}

module.exports = function (router) {

    router.get('/getEtherAddress/{email}',
    (req,res,next) => {
        next();
        },
        getEtherAddress
    );

    router.get('/etherTransactionHistory/{address}',
        (req,res,next) => {
            next();
        },
        etherTransactionHistory
    );

    router.get('/etherTransactionHash/{hash}',
        (req,res,next) => {
            next();
        },
        etherTransactionHash
    );

    router.get('/getEtherBalance/{address}',
        (req,res,next) => {
            next();
        },
        getEtherBalance
    );

    router.post('/transferEther',
    (req,res,next) => {
            next();
        },
        transferEther
    );
}
