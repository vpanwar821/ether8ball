const logger = require('../utils/logger').logger;
const User = require('../models/user');
const Cue = require('../models/cue');
import { getCueList } from '../services/auctionService';
import { getCueAddressList } from '../services/cueCoreService';

const getSellCueList = async(req,res,next) => {
    try{
        let list = await getCueList();
        return res.status(200).json({
            status:"success",
            code:200,
            message:"Cues sell list",
            data:list
        })
    }
    catch(err){
        return res.status(500).json({
            status:"error",
            code:500,
            message:"Error in getting selling list"
        })
    }
} 

const getCuesOfAddress = async(req,res,next) => {
    try{
        let user = User.find({email:req.params.email});
        let cueList = await getCueAddressList(user.pubKey);
        // let cueList = await getCueAddressList("0x0fE38899d98e35A4AAfA759Ac03Dff9793407eE0");
        return res.status(200).json({
            status:"success",
            code:200,
            message:"Cue list created successfully for address",
            data:cueList
        })
    }
    catch(err){
        return res.status(500).json({
            status:"error",
            code:500,
            message:"Error in getting cue list for address"
        })
    }
}

const getCueDetail = async(req,res,next) => {
    try{
        let cueDetails = await Cue.find({cueId:req.params.cueId});
        logger.info("Successful in getting cue details for cueid:",req.body.cueId);
        return res.status(200).json({
            status:"success",
            code:200,
            message:"Successful in getting cue details",
            data:cueDetails
        })
    }
    catch(err){
        logger.error("Error in getting cue details",err);
        return res.status(500).json({
            status:"error",
            code:500,
            message:"Error in getting cue details"
        })
    }
}

module.exports = function(router){
    router.get('/sellCueList',
        (req,res,next) =>{
            next();
        },
        getSellCueList 
    );

    router.get('/getCueList/{email}',
        (req,res,next) => {
            next();
        },
        getCuesOfAddress
    );

    router.get('/getCueDetail/{cueId}',
        (req,res,next) => {
            next();
        },
        getCueDetail
    )
}