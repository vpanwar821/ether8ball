const config = require('config');
var Web3 = require('web3');
export var web3;
import EthereumTx from 'ethereumjs-tx';
import { encrypt,decrypt } from '../helpers/encryption';

if(config.TESTING == true){
    web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/eenkErjk3rtwXMAOCZjb'));
}
else
{
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