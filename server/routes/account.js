var mongoose = require('mongoose');
var passport = require('passport');
var config = require('config');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var services = require('../services/accountService.js');
const logger = require('../utils/logger').logger;
var mail = require('../services/email.js');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
import { getEtherAddress } from '../services/ethereumService';

const signup = async(req,res, next) => {
	try {
		var email =  req.body.email;
		if (!email || !req.body.password) {
			return res.status(403).send({
				status:"error",
				code:"403",
				message:"Failure",
			});
		} else {
			logger.info("Signup for thr user:",email);
			var newUser = new User({
				email: email.toLowerCase(),
				password: req.body.password,
				name: req.body.name,  
			});
			// save the user
			newUser.save(async(err)=> {
				if (err) {
					logger.error("Email already exist",email);
					return res.status(403).send({
						status:"error",
						code:"403",
						message:"Email already exists",
					});
				}
				else {
					var mailSending = await mail.welcomeMail(email);
					
					if(mailSending) {
						return res.status(200).send({
							status:"success",
							code:"200",
							message:"Successfully Registered ",
						});
					} else {
						return res.status(403).send({
							status:"error",
							code:"403",
							message:"Error in signup",
						});
					}
				}	
			});
		}
	} catch (err) {
		logger.error("Signup error",err);
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"error during signup",
		});
	}
};

// singin 
const signin = async(req, res, next) => {
	try{
		var user = await User.findOne({email: req.body.email},{"ETHPrivKey":0,_id:0});
		if(!user){
			return res.status(403).send({
				status:"error",
				code:"403",
				message:"User doesnot exist"
			});	
		}
		else{
			if(user.gmailSignin == false){
				if(user.facebookSignin == false){
					let isMatch = await bcrypt.compareSync(req.body.password,user.password);
					if(isMatch){
						var token = jwt.sign(user.toObject(), config.SECRET);
							// return the information including token as JSON
							return res.status(200).send({
								status:"success",
								code:"200",
								token: 'JWT ' + token,
								message:"Logged in successfully",
						});
					}
					else{
						return res.status(403).send({
							status:"error",
							code:"403",
							message:"Password is incorrect",
						});
					}
				}
				else{
					return res.status(403).send({
						status:"error",
						code:"403",
						message:"Sign in using facebook",
					});
				}
			}
			else{
				return res.status(403).send({
					status:"error",
					code:"403",
					message:"Sign in using gmail",
				});
			}
		}
	}
	catch(err){
		logger.error("Sign in failure:",err);
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Sign in failure",
		});
	}
}

// login and signup with gmail api
const loginWithGoogle = async(req,  res, next) => {
	try{
		if (!req.body.email) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Please pass email",
			});
		} else {
			var getUser = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
			if(getUser){
				var token = await jwt.sign(getUser.toObject(), config.SECRET);
				logger.info("Login successful using gmail",req.body.email);
				return res.status(200).send({
					status:"success",
					code:"200",
					message:"Logged in Successfully",
					token: 'JWT ' + token,
					
				});
			} else {
				var newUser = new User();
				newUser.id = req.body.id;
				newUser.name = req.body.name;
				newUser.email = req.body.email.toLowerCase();
				newUser.gmailSignin = true;
				// save the user
				newUser.save(async(err)=> {
					if (err) {
						logger.error("login error using gmail",req.body.email);
						return res.status(403).send({
							status:"error",
							code:"403",
							message:"Login Error",
						});
					} else {
						var result = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
						if(result){
							var token = await jwt.sign(result.toObject(), config.SECRET);
							logger.info("login in successful using gmail",req.body.email);
							return res.status(200).send({
								status:"success",
								code:"200",
								message:"Logged in Successfully",
								token: 'JWT ' + token,
							});
						}
					}
				});
			}
		}
	}
	catch(err){
		logger.error("Error login using gmail",err);
		return res.status(500).send({
			"status":"error",
			"code":500,
			"message":"Error in login using gmail"
		})
	}
}

// login and signup with Facebook api
const loginWithFacebook = async(req,  res, next) => {
	try{
		if (!req.body.email) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Please pass email",
			});
		} else {
			var getUser = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
			if(getUser){
				var token = await jwt.sign(getUser.toObject(), config.SECRET);
				logger.info("Logged in successfully",req.body.email);
				return res.status(200).send({
					status:"success",
					code:"200",
					message:"Logged in Successfully",
					token: 'JWT ' + token,
				});
			} else {
				var newUser = new User();
				newUser.id = req.body.id;
				newUser.name = req.body.name;
				newUser.email = req.body.email.toLowerCase();
				newUser.facebookSignin = true;
				// save the user
				newUser.save(async(err)=> {
					if (err) {
						logger.error("Error in signin using facebook",req.body.email);
						return res.status(403).send({
							status:"error",
							code:"403",
							message:"Login Error",
						});
					} else {
						var result = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
						if(result){
							var token = await jwt.sign(user.toObject(), config.SECRET);
							return res.status(200).send({
								status:"success",
								code:"200",
								message:"Logged in Successfully",
								token: 'JWT ' + token,
							});
						}
					}
				});
			}
		}
	}
	catch(err){
		logger.error("Error in sigin using facebook",err);
		return res.status(500).send({
			"status":"error",
			"code":500,
			"message":"Failure"
		})
	}
}

const verifyEmail = async (req,res,next) => {
    let token = req.params.token;
    try{
		let result = await services.verifytoken(token);
		logger.info({"message": "success","data": result});
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Successfully email OTP verified",
			data: result
		});	
    }
    catch(err){
      	logger.error(err);
      	res.status(500).send({"message":"failure", "data":err});
    }
}

// updateUserProfile with email id
const updateProfile = async(req,res, next) => {
	
	var token = getToken(req.headers);
	if (token) {
		var myquery = {email:req.body.email};
		var myvalues = {$set:{ name: req.body.name}};
		await User.update(myquery,myvalues);
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Successful updated user profile",
		});							
	} else {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Unauthorized user",
		});
	}
}

const getUsers= async(req,	res, next) => {
	
	var token = getToken(req.headers);
	if (token) {
		User.find({},{"ETHPrivKey":0, _id:0}, function (err, result) {
			if (err) return next(err);
			return res.status(200).send({
				status:"success",
				code:"200",
				message:"Successful getting users list",
				data: result
			});
		});
	} else {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Unauthorized",
		});
	}
};

// get User Profile
const getUserProfile= async(req, res, next) => {
	var token = getToken(req.headers);
	if (token) {
		User.findOne({"email": req.params.email},{"ETHPrivKey":0,_id:0},function (err, result) {
			if (err) return next(err);
			return res.status(200).send({
				status:"success",
				code:"200",
				message:"Successful getting user profile",
				data: result
			});
		});
	} else {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Unauthorized",
		});
	}
};

// forgot password
const forgotPassword= async(req, res, next) => {
	var email =	req.params.email; 
	try{
		let result = await services.forgotPassword(email);
		let sendMail = mail.forgotPasswordLink(email,result.userName,result.token);
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Success",
		});
	}
	catch (err) {
		if(err == 'Please login with gmail'){
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Please login with gmail"
			});
		}
		if(err == 'Please login with facebook'){
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Please login with facebook"
			});
		}
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Unauthorized",
		});
	}
};

// set forgotPassword 
const forgotPasswordSet= async(req, res, next) => {
	var token = req.body.token;
	var password = req.body.password;
	
	try{
		let result = await services.setForgotPassword(token, password);
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Success",
		});
	}
	catch (err) {
		if(err == "Password Reset link has been expired"){
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Password reset link has been expired",
			});
		}
		else{
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"failure",
				data: err
			});
		}
	}
};

// set resetPassword 
const resetPassword= async(req,	res, next) => {
	var token = getToken(req.headers);
	var email =	req.body.email;
	var oldPassword = req.body.oldPassword;
	var password = req.body.password;
	
	if(token){
		try{
			let result = await services.setResetPassword(email, oldPassword, password);
			return res.status(200).send({
				status:"success",
				code:"200",
				message:"Success",
				data: result
			});
		} catch (err) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"failure",
				data: err
			});
		}
	} else {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"failure",
			data: err
		});
	}
};

// authorization
function getToken(headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
		
	} else {
		return null;
	}
};

module.exports = function(router){
	
	// local signup
	router.post('/signup', (req,res,next) => {
			next();						
		},
		signup
	);

	// local login
	router.post('/signin', (req,res,next) => {
			next();						
		},
		signin
	);

	// gmail login
	router.post('/saveGoogleData',
		(req,res,next) => {
			next();            
		},
		loginWithGoogle
	);

	// facebook login 
	router.post('/saveFacebookData',
		(req,res,next) => {
			next();            
		},
		loginWithFacebook
	);

	router.get('/verifyEmail/{token}',
		(req,res,next) => {
        	next();
      	},
      	verifyEmail
    );

	router.post('/updateProfile', passport.authenticate('jwt', { session: false}), (req,res,next) => {
			next();						
		},
		updateProfile
	);

	router.get('/getUsers', passport.authenticate('jwt', { session: false}), (req,res,next) => {			
			next();						
		},
		getUsers
	);

	router.get('/getUserProfile/{email}', passport.authenticate('jwt', { session: false}), (req,res,next) => {
			next();						
		},
		getUserProfile
	);

	router.get('/forgotPassword/{email}', (req,res,next) => {
			next();						
		},
		forgotPassword
	);

	router.post('/setForgotPassword', (req,res,next) => {
			next();						
		},
		forgotPasswordSet
	);

	router.post('/resetPassword', passport.authenticate('jwt', { session: false}), (req,res,next) => {
			next();						
		},
		resetPassword
	);
}

