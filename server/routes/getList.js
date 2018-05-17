const logger = require('../utils/logger').logger;
var Auction = require("../models/auction");
var Cue = require('../models/cue');
var CueName = require('../models/cueName');

const getAuctionList = async(req,res,next) => {
    try{
        var auctionList = await Auction.find({auctionOpen:true});
        var cueList = [];
        for(var i=0; i<auctionList.length; i++){
            var cueFind = await Cue.find({cueId:auctionList[i].cueId});
            cueList.push(cueFind);
        }
        logger.info("Succefully created the list of auction cues");
        return res.status(200).send({
            status:"success",
            code:"200",
            message:"Success",
            data:cueList
        });
    }
    catch(err){
        logger.error("Error in creating the list of auction cues");
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"failure"
        });
    }
}

const createFamily = async(req,res,next) => {
    try{
        var cueFamily = new CueName({
            family:req.body.family,
            sequence:req.body.sequence,
            name:req.body.name
        });
        cueFamily.save(function(err) {
			if (err) {
                console.log(err);
				return res.status(403).send({
                    status:"error",
                    code:"403",
                    message:"Error in adding name."
                });
            }
            return res.status(200).send({
                status:"success",
                code:"200",
                message:"Successfully name added."
            });
			
		});
    }
    catch(err){
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure"
        });
    }
}

module.exports = function(router){
    router.post('/auctionList',
        (req,res,next) => {
            next();
        },
        getAuctionList
    );

    router.post('/createFamily',
        (req,res,next) => {
            next();
        },
        createFamily
    );
}