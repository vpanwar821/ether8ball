import { web3 } from './ethereumService';
const config = require('config');
import BigNumber from 'bignumber.js';
import { logger } from '../utils/logger';
var contractAddress;

const contractAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "bid",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "cancelAuction",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "cancelAuctionWhenPaused",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "name": "_startingPrice",
                "type": "uint256"
            },
            {
                "name": "_endingPrice",
                "type": "uint256"
            },
            {
                "name": "_duration",
                "type": "uint256"
            },
            {
                "name": "_seller",
                "type": "address"
            }
        ],
        "name": "createAuction",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "pause",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "unpause",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "Unpause",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "Pause",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "AuctionCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "totalPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "winner",
                "type": "address"
            }
        ],
        "name": "AuctionSuccessful",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "startingPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "endingPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "AuctionCreated",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdrawBalance",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_nftAddr",
                "type": "address"
            },
            {
                "name": "_cut",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "averageGen0SalePrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0SaleCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "getAuction",
        "outputs": [
            {
                "name": "seller",
                "type": "address"
            },
            {
                "name": "startingPrice",
                "type": "uint256"
            },
            {
                "name": "endingPrice",
                "type": "uint256"
            },
            {
                "name": "duration",
                "type": "uint256"
            },
            {
                "name": "startedAt",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "getCurrentPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isSaleClockAuction",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "lastGen0SalePrices",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "nonFungibleContract",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "ownerCut",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

if(config.TESTING == true) {
    contractAddress = config.AUCTION_CONTRACT_ADDRESS_DEV;
}
else {
    contractAddress = config.AUCTION_CONTRACT_ADDRESS_PROD;
}

const Contract = new web3.eth.Contract(contractAbi, contractAddress);

export const getCurrentPrice = async(cueId) => {
	try{
        let result = await Contract.methods.getCurrentPrice(cueId).call();
        result = new BigNumber(result).dividedBy(new BigNumber(10).pow(18)).toNumber();
		return result;
	}
	catch(err){
		logger.error("Error in getting current price",err);
	}
}

export const bid = async(cueId) => {
	try{
		let result = await Contract.methods.bid(cueId).encodeABI();
		return result;
	}
	catch(err){
		logger.error("Error in getting current price",err);
	}
}
