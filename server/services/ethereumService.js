/*****************************Node modules ***************************/
const logger = require('../utils/logger').logger;
import BigNumber from 'bignumber.js';
BigNumber.config({ ERRORS: false });
import {encrypt} from '../helpers/encryption';
var User = require("../models/user");
import Web3 from 'web3';
import EthereumTx from 'ethereumjs-tx';
const ethers = require('ethers');


/***************************Import local modules **************************/
import { decrypt } from '../helpers/encryption';
var config = require('config');
export var web3;

if(config.TESTING === true){
    //Ethereum testnet connection
	  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/eenkErjk3rtwXMAOCZjb'));  
	
}
else{
    //Ethereum mainnet connection
      web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/mROzXUBaQKkqSyXQFXLq'));  
 }
export const createRawTransaction = async(code, keys, to, value, password, gas) => {        
	let gasPrice;
	if (gas === null || gas === undefined || parseInt(gas) < 50000) {
	    gas = 450000;
		gasPrice = 21000000000;
	}
    else {
		gas = parseInt(gas);
		gasPrice = 11000000000;
	}

	var privk = decrypt(keys.privkey, password);
	privk = privk.toString();
	
	const txParams = {
	    nonce: await web3.eth.getTransactionCount(keys.pubkey),
	    gasLimit: gas,
	    gasPrice: gasPrice, 
		value: value,	
		to:to
	}
	if (code) {
	    txParams.data = code;
	}
	console.log(txParams);
	const tx = new EthereumTx(txParams);
	tx.sign(Buffer.from(removeHexPrefix(privk), 'hex'));
	return tx.serialize();
}

function removeHexPrefix(str) {
  return str.replace(/^0x/, '');
}


   
   



