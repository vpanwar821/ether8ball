var GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
var crypto = require("crypto");
var async = require("async");
var User = require("../models/user");
var bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const logger = require('../utils/logger').logger;
var mail = require('./email');

module.exports={


    verifytoken: async(token) => {
        let result = {};

        try{
            let user = await User.findOne({"emailVerifyToken":token});
        
            if(!user){
                throw "user doesnot exist";
            }
            else{
                if(user.emailVerifyToken == token){
                    var currentDate = moment(new Date());
                    var otpDate = moment(user.tokenCreatedAt);
                    var newDiff = currentDate.diff(otpDate,'seconds');
                    if(newDiff > 600)
                    {
                        logger.error("Otp has been expired");
                        throw "token has been expired";
                    }
                    else{
                        let myquery = {email:user.email};
                        let myvalues = {$set:{isVerified:true}};
                        await User.update(myquery,myvalues);
                        await mail.welcomeMail(user.email);
                        result.email = user.email;
                        result.message = "token is correct";
                        return result;
                    } 
                }
                else{
                    logger.error("invalid otp");
                    throw "invalid Otp";
                }
            }
        }catch(err){
            logger.error("error in searching in database:"+err);
            throw err;
        }
    },


    resetOtp: async(email) => {
        let result = {};
        let OTPCode;
        let myquery;
        let myvalues;
        try{
            let user = await User.findOne({"email":email});
            if(!user){
                throw "user doesnot exist";
            }
            else{
                    
                OTPCode = getRandom(100000, 999999);
                myquery = {email:user.email};
                myvalues = {$set:{emailOTP:OTPCode,emailOtpCreatedAt:Date.now()}};
                await User.update(myquery,myvalues);
                await mail.welcomeMail(user.email, OTPCode);        
                result.message = "OTP sent successfully";
                return result;
        
            }
        }catch(err){
            logger.error("error in searching in database:"+err);
            throw err;
        }
    },

    forgotPassword: async(email) => {							
        var token;
        var result = {};
        
        try {
            var buf = await crypto.randomBytes(20);
            token = buf.toString('hex');
            var user = await User.findOne({"email": email});
            if(user.gmailSignin != false){
                throw "Please login with gmail";
            }
            if(user.facebookSignin != false){
                throw "Please login with facebook api";
            }
            if(!user){
                throw "user does not exist";                    
            }else{                  
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
        } catch(err) {
            logger.error(err);
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
            logger.error(err);
            throw err;
        }
    },
}

const getRandom = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


const comparePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};