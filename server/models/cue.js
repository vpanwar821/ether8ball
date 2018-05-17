var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var CueSchema = new Schema({
    tmpId :  {type: String, required: true, index :{unique:true}},
    cueId : {type: Number},
    name : {type:String},
    family : {type:String},
    tip : {type:String},
    shaft : {type:String},
    shaftCollar : {type:String},
    joint : {type:String},
    forewrap : {type:String},
    wrap : {type:String},
    sleeve : {type:String},
    buttcap : {type:String},
    bumper : {type:String},
    imageUrl:{type:String}
});


module.exports = mongoose.model('Cue', CueSchema);