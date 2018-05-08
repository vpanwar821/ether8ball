
var crypto = require("crypto");
var async = require("async");
var User = require("../models/user");
var bcrypt = require('bcrypt-nodejs');
var mail = require('../routes/email');
const moment = require('moment');
var mail = require('../routes/email');
module.exports={

    forgotPassword: async(email) => {							
        var token;
        var result = {};
        try {
            var buf = await crypto.randomBytes(20);
            token = buf.toString('hex');
            var user = await User.findOne({"email": email});
            if(!user){
                throw "user does not exist";                    
            }else{                  
                if(user){  
                    var sendToEmail = user.email;
                    var userName = user.firstName;
                    // let mail = await mail.forgotPasswordLink(sendToEmail,userName, token);
                    var time = Date.now();
                    var myquery = {email:user.email};
                    var newvalues = {$set:{forgotPassswordToken:token, forgotPassswordTokenCreatedAt: time}};
                    var res = await User.update(myquery,newvalues);
                    if(res.n != 0 || res.nModified !=0) {
                        result.token = token;
                        result.message = "Token update in database";
                    } else {
                        throw "Error  in updating token";
                    }    
                }
                return result; 
            }
        } catch(err) {
            throw err;
        }    
    },

    setForgotPassword: async(token, password) => {
        var result;
        try { 
            var user = await User.findOne({"forgotPassswordToken": token });

            if(!user){
                throw "user does not exist";                    
            }else{
                if(user.forgotPassswordToken == token){
                    var currentDate = moment(new Date());
                    var otpDate = moment(user.forgotPassswordTokenCreatedAt);
                    var newDiff = currentDate.diff(otpDate,'seconds');
                    
                    if(newDiff > 600)
                    {
                        throw "Password Reset link has been expired";
                    }                  
                    else {
                        var hash = bcrypt.hashSync(password);
                        var myquery = {email:user.email};
                        var newvalues = {$set:{password:hash}};
                        var res = await User.update(myquery,newvalues);
                        if(res.n != 0 || res.nModified !=0) {
                            result = "password update";
                        } else {
                            throw "Error  in updating password";
                        }
                        var userName =  user.firstName;
                        var sendToEmail = user.email;
                        // let mail = await mail.confirmationMailForpasswordReset(sendToEmail);
                    }
                }
                return result;
            } 
        } catch(err) {
            logger.error(err);
            throw err;
        }    
    },


    setResetPassword: async(email, oldPassword, password) => {
		var result;
        var projection = {
            "firstName" : true,
            "lastName" : true,
            "password":true,
            "email" : true,
        }
        
        try { 
            var user = await User.findOne({"email": email }, projection);
            if(!user){
                throw "user does not exist";         
            }else{  
                if(user){
                    var validPassword = await comparePassword(oldPassword, user);
                    if(validPassword == true){
                        console.log(email, oldPassword, password);
                        var hash = bcrypt.hashSync(password);
                        var myquery = {email:user.email};
                        var newvalues = {$set:{password:hash}};
                        var res = await User.update(myquery,newvalues);
                        if(res.n != 0 || res.nModified !=0) {
                            result = "password update";
                        } else {
                            throw "Error  in updating password";
                        }
                        var userName = user.firstName;
                        var sendToEmail = user.email;
                    // let mail = await  mail.confirmationMailForpasswordReset(sendToEmail); 
                    } else {
                        throw "Old password not matching";
                    }                  
                }
                return result;
            } 
        } catch(err) {
            throw err;
        }
    },
}

const comparePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};