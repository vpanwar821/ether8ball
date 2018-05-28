const logger = require('../utils/logger').logger;
import { getCueList } from '../services/auctionService';

const getSellCueList = async(req,res,next) => {
    try{
        let list = await getCueList();
        return res.send(200).status({
            status:"success",
            code:200,
            message:"Cues sell list",
            data:list
        })
    }
    catch(err){
        return res.send(500).status({
            status:"error",
            code:500,
            message:"Error in getting selling list"
        })
    }
} 

module.exports = function(router){
    router.post('/sellCueList',
        (req,res,next) =>{
            next();
        },
        getSellCueList 
    )
}