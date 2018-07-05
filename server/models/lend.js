var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var LendSchema = new Schema({
    tmpId :  {type: String, required: true, index :{unique:true}},
    email : {type: String, required: true,match: /.+@.+\..+/,lowercase : true},
    lendCueDetails : [{
            cueGene : {type : String},
            cueCoinAmount : {type: Number},
            ethAmount : {type:Number}	
    }]
});


module.exports = mongoose.model('Lend', LendSchema);