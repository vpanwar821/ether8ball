import web3 from './ethereumService';
const config = require('config');

const contractAbi; 

if(config.TESTING == true) {
    contractAddress = config.AUCTION_CONTRACT_ADDRESS_DEV;
}
else {
    contractAddress = config.AUCTION_CONTRACT_ADDRESS_PROD;
}

const auctionContract = new web3.eth.Contract(contractAbi, contractAddress);