const logger = require('../utils/logger').logger;
const ethers = require('ethers');
const config = require('config');
var bcrypt = require('bcrypt-nodejs');
var mail = require('../services/email.js');
var moment = require('moment');
var dateFormat = require('dateformat');
import {encrypt, decrypt} from '../helpers/encryption';
import rp from 'request-promise';
import { createRawTransaction, web3} from '../services/ethereumService.js';
import BigNumber from 'bignumber.js';
import { getRandom } from '../helpers/randomNumber';
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
// generating ethereum address with emailID
const getEtherAddress = async(req, res, next) => {
    if(req.params.email){
        let wallet = new ethers.Wallet.createRandom();
        let password = req.params.email + config.SECRET_KEY;
        let privateKey = encrypt(wallet.privateKey,password);
        let myquery = {email:req.params.email};
        let myvalue = {$set:{ETHAddress:wallet.address,ETHPrivKey:privateKey, addressGenerated: true}};
		var result =  await User.update(myquery,myvalue);
		if(!result){
            logger.info("Error in generating address of user:"+req.params.email);
            return res.status(500).send({
                status:"error",
                code:"500",
                message:"Error in generating address",
            });
		} else {
            logger.info("Ether address generated of user:"+req.params.email);
            return res.status(200).send({
                status:"success",
                code:"200",
                message:"Successfully generated address",
                publicKey: wallet.address
            });
		}
    }
    else{
        logger.error("Error in getting email in getEtheraddress");
		return res.status(500).send({
            status:"error",
            code:"500",
            message:"Ethereum address not generated",
        });
    }
}

const exportPrivKey = async(req, res, next) => {
    try{
        var user = await User.findOne({ email: req.body.email.toLowerCase() })
        if (!user) {
            return res.status(403).json({
            "status": "error",
            code: 403,
            "message": "User doesnot exists"
            });
        }else if (!user.ETHAddress) {
            return res.status(403).json({
            "status": "error",
            code: 403,
            "message": "Please generate your address"
            });
        } else {
                logger.info("Export private key for user",req.body.email);
                if(user.otp == req.body.otp){
                    let currentTime = moment(new Date());
                    let otpTime = moment(user.otpCreatedAt);
                    var newDiff = currentTime.diff(otpTime,'seconds');
                    if(newDiff > 600){
                        logger.error("Export private key:Otp has been expired of user:",user.email);
                        return res.status(403).send({
                            "status":"error",
                            "code":403,
                            "message":"Otp has been expired"
                        });
                    }
                    else{
                        let password = req.body.email + config.SECRET_KEY;
                        const privKey = decrypt(user.ETHPrivKey, password);
                        logger.info("Successfully exported private key of user",req.body.email);
                            return res.status(200).send({
                                    "status": "success",
                                    code:200,
                                    "message": "Success",
                                    data: privKey.toString()
                            });
                        }
                }
                else{
                    logger.error("Export private key:Otp is incorrect of user:",user.email);
                    return res.status(403).send({
                        "status":"error",
                        "code":403,
                        "message":"Otp is incorrect"
                    })
                }
            
            }
    }
    catch(err){
        logger.error("Error in exporting private key",err);
        return res.status(500).send({
            "status":"error",
            "code":500,
            "message":"Error in exporting key"
        })
    }
}
  
const importPrivKey = async(req, res, next)=> {
    
    const email = req.body.email;
    let password = email + config.SECRET_KEY;
    var wallet;
    try {
        wallet = new ethers.Wallet('0x'+req.body.privKey);
        var user  = await User.findOne({ email: email.toLowerCase()})
        if (!user) {
            return res.status(403).json({
            "status": "error",
            code: 403,
            "message": "User doesnot exists"
            });
        }
        else {
            if(wallet.address)
            {
                let myquery = {email:user.email};
                let myvalue = {$set:{ETHAddress:wallet.address,addressGenerated: true, ETHPrivKey:encrypt(wallet.privateKey, password)}};
                var result = await User.update(myquery, myvalue);
                if(result){
                    logger.info("Wallet imported successfully through private key of user",req.body.email);
                    return res.status(200).send({
                        "status": "success",
                        code:200,
                        "message":"Wallet imported successfully",
                        data: wallet.address
                    });
                } else {
                    logger.error("Error in importing wallet address through private key of user",req.body.email);
                    res.status(403).send({
                        "status": "error",
                        code:500,
                        message: "Error in importing wallet address",
                    });
                }
            }else{
                res.status(403).send({
                "status": "error",
                code:403,
                message: "Please enter valid key"
                });
            }
        }
    } catch(err) {
        logger.error("Error in importing wallet address through private key of user",err);
        res.status(500).send({
            "status": "error",
            code:403,
            message: "Error in importing wallet address",
        });
    }
    
}

//  import ethereum address from JSON file
const importThroughUtc = async(req, res, next) => {
    
    try {
        var email = req.body.email;
        let password = email + config.SECRET_KEY;
        var walletPassword = req.body.walletPassword;
        let wallet = await ethers.Wallet.fromEncryptedWallet(req.body.utcFile,walletPassword);
        var user = await User.findOne({ email:email.toLowerCase()});
        
        if(user.addressGenerated === false) {
            let myquery = {email:user.email};
            let myvalue = {$set:{ETHAddress:wallet.address,addressGenerated: true, ETHPrivKey:encrypt(wallet.privateKey, password)}};
            var result = await User.update(myquery, myvalue);
            logger.info("Address generated successfully through json for user.",email);
            return res.status(200).send({
                    "status": "success",
                    code:200,
                    message: "Address generated successfully.",
                    data: wallet.address
                });
        } else {
            logger.error("Address already exist through json for user.",email);
           return res.status(403).send({
                "status":"error",
                code:403,
                message: "Address already generated."
            });
        }
    } catch (err) {
        logger.error("Error in generating address through json file.",err);
        return res.status(500).send({
            "status":"error",
            code:403,
            message: "Incorrect wallet passsword/UTC file."
        });
    }
    
}



const etherTransactionHistory = async(req,res,next) => {

    var table = [];
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
  
    rp(apiUrl).then(json => {
        const transactionHistory = JSON.parse(json).result;
        for(let i=transactionHistory.length-1; i>=0; i--)
        {   
            var d = new Date((transactionHistory[i].timeStamp * 1000)).toDateString();
            var newDate = dateFormat(d, "longDate");
            table.push({hash:transactionHistory[i].hash,date:newDate});
        }
        return res.status(200).json({
            "status":"success",
            "code":200,
            "transactions": table
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
                "message": "Error: Transaction hash",
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
    let rawTx;
    var password = req.body.email + config.SECRET_KEY;

    var etherAmount = (req.body.value)- 0.000861;
   
    logger.info("Entered into the transfer ether for user:"+req.body.email);
    
    try{
        if(etherAmount >= 0){
            var user = await User.findOne({"email":req.body.email});
            let balance = await web3.eth.getBalance(user.ETHAddress);      
            var newBalance = new BigNumber(balance);
            var etherString = newBalance.dividedBy(new BigNumber(10).pow(18)).toNumber();
            if(etherString >= req.body.value){
                if(user.otp == req.body.otp){
                    let currentTime = moment(new Date());
                    let otpTime = moment(user.otpCreatedAt);
                    var newDiff = currentTime.diff(otpTime,'seconds');
                    if(newDiff > 600){
                        logger.error("Otp has been expired for user:",user.email);
                        return res.status(403).send({
                            "status":"error",
                            "code":403,
                            "message":"Otp has been expired"
                        });
                    }
                    else{
                        logger.info("Otp is correct generating raw transaction.");
                        const keys = { pubkey: user.ETHAddress, privkey: user.ETHPrivKey };
                        rawTx = await createRawTransaction('', keys, req.body.ethereumAddress, (new BigNumber(etherAmount).times(new BigNumber(10).pow(18))).toNumber(), password, req.body.gas);
                        logger.info("Raw transaction generated successfully");
                    }
                }
                else{
                        logger.error("Otp is incorrect of user",user.email);
                        return res.status(403).send({
                            "status":"error",
                            "code":403,
                            "message":"Otp is incorrect"
                        })
                    }  
            }
            else{
                logger.error("Insufficient balance",user.email);
                        return res.status(403).send({
                            "status":"error",
                            "code":403,
                            "message":"Insufficient Balance"
                    })
            }
            
        }
        else{
            logger.error("Amount is not valid");
                    return res.status(403).send({
                        "status":"error",
                        "code":403,
                        "message":"Amount is not valid"
                    })
        }
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
            logger.info("Ether transferred successfully");
            return res.status(200).send({
                "status":"success",
                "code":200,
                "message":"Ether successfully transferred",
                "transactionHash":receipt.transactionHash
            });
        })
        .on('error',async (error) => {
            logger.error("error in transferring ether:",error);
            return res.status(500).json({
                "status": "Failure",
                "code": 500,
                "message": "Error in transferring Ether",
            });
        })
        
    }
    catch(e) {
      logger.error("error in transferring ether:",e);
      return res.status(500).json({
        "status": "Failure",
        "code": 500,
        "message": "Error in transferring Ether",
      });
    }
}

const generateOtp = async(req,res,next) => {
    try{
        var user = User.findOne({email:req.body.email});
        var otpCode = getRandom(100000, 999999);
        var query = {email:req.body.email};
        var value = {$set:{otp:otpCode,otpCreatedAt:Date.now()}};
        var result = await User.update(query,value);
        await mail.OtpMail(req.body.email,otpCode);
        return res.status(200).send({
            "status":"success",
            "code":200,
            "message":"Success"
        });
    }
    catch(err){
        return res.status(500).send({
            "status":"Failure",
            "code":500,
            "message":"error"
        })
    }
}

// const gasEstimate = async(req,res,next) => {
//     try{
//         let gas = await estimateGas();
//         return res.status()
//     }
//     catch(err){

//     }
// }

module.exports = function (router) {

    router.get('/getEtherAddress/{email}',
        (req,res,next) => {
            next();
        },
        getEtherAddress
    );

    router.post('/importPrivKey',
        (req, res, next) => {
            next();
        },
        importPrivKey
    );

    router.post('/exportPrivKey',
        (req, res, next) => {
            next();
        },
        exportPrivKey
    );

    router.post('/importThroughUtc',
        (req, res, next) => {
            next();
        },
        importThroughUtc
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

    router.get('/etherTransactionHistory/{address}', (req,res,next) => {
        next();
    },
        etherTransactionHistory
    );

    router.get('/etherTransactionHash/{hash}', (req,res,next) => {
        next();
    },
        etherTransactionHash
    );

    router.post('/generateOtp', (req,res,next) => {
        next();
    },
        generateOtp
    );
}
