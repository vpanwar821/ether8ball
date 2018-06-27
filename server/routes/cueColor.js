var PNGImage = require('pngjs-image');
var Cue = require("../models/cue");
const logger = require('../utils/logger').logger;

const changeCueColor = async(req,res,next) => {
    try{
        let cue = await Cue.find({cueId:req.body.cueId});
        console.log(cue[0].imageUrl);
        let image = await PNGImage.readImage("/Users/vikas/Documents/workspace/ether8ball/server/services/images/cueimage/bronze/test.png");
        console.log(image);
        console.log(image.getWidth());
        console.log(image.getHeight());
    }
    catch(err){

    }
}

module.exports = function(router){
    router.post('/changeColor',
        (req,res,next) => {
            next();
        },
        changeCueColor
    );
}