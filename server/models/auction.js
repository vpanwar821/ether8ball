var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var AuctionSchema = new Schema({
    tmpId :  {type: String, required: true, index :{unique:true}},
    cueId : {type: Number},
    auctionOpen:{type:Boolean,default:false}
});


module.exports = mongoose.model('Lend', AuctionSchema);