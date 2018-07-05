var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var CueNameSchema = new Schema({
    
    family : {type:String},
    sequence: {type:String},
    name : {type:String}
});


module.exports = mongoose.model('CueName', CueNameSchema);