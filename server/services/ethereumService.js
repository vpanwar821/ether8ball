/*****************************Node modules ***************************/
import BigNumber from 'bignumber.js';
BigNumber.config({ ERRORS: false });
import Web3 from 'web3';
import EthereumTx from 'ethereumjs-tx';

/***************************Import local modules **************************/
import { decrypt } from '../helpers/encryption';
import { Error } from 'mongoose';
var config = require('config');
const bcrypt = require('bcrypt-nodejs');
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
	    gas = 70000;
		gasPrice = 11000000000;
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
	    value,
	    to
	}
	if (code) {
	    txParams.data = code;
	}
	const tx = new EthereumTx(txParams);
	tx.sign(Buffer.from(removeHexPrefix(privk), 'hex'));
	return tx.serialize();
}

// export function transferToken(to, value, pubkey) {
//     return Contract.transfer.getData(to, value, { from: pubkey });
// }

// export function transferFromToken(fromAddr, to, value, pubkey ) {
//     return Contract.transferFrom.getData(fromAddr, to, value, { from: pubkey });
// }

// export function approveToken(spender, value, pubkey) {
//     return Contract.approve.getData(spender, value, { from: pubkey });
// }
// export function allowanceToken(owner, spender) {
//     return Contract.allowance.call(owner, spender);
// }
// export function balanceOfToken(address) {
//     return Contract.balanceOf.call(address);
// }

export function sendTransaction(serializedTx) {
	return new Promise ((resolve,reject) => {
		web3.eth.sendSignedTransaction(('0x' + serializedTx.toString('hex')),(err,data) => {
			if(err){
				return reject(err);
			}
			else{
				return resolve(data);
			}
		});
	});
}

function removeHexPrefix(str) {
  return str.replace(/^0x/, '');
}

export function getReceipt(txHash) {
  return web3.eth.getTransactionReceipt(txHash);
}

export function waitUntilMined(receipts) {
  const txn = web3.eth.getTransactionReceipt(receipts);
  if(!txn) {
    return null
  } else {
    return txn;
  }
}