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
import { getEtherAddress } from '../services/ethereumService';

const getRandom = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const signup = async(req,res, next) => {
	try {
		var email =  req.body.email;
		if (!email || !req.body.password) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Failure",
			});
		} else {
			// var OTPCode = await getRandom(100000, 999999);
			
			var buf = await crypto.randomBytes(20);
			var token = await buf.toString('hex');

			var newUser = new User({
				email: email.toLowerCase(),
				password: req.body.password,
				name: req.body.name,
				emailVerifyToken  : token,    
                tokenCreatedAt : Date.now(),
			});
			// save the user
			newUser.save(async(err)=> {
				if (err) {
					return res.status(500).send({
						status:"error",
						code:"500",
						message:"Email already exists",
					});
				}
				else {
					var mailSending = await mail.welcomeMail(email, token);
					
					if(mailSending) {
						return res.status(200).send({
							status:"success",
							code:"200",
							message:"Successful created new user",
						});
					} else {
						return res.status(500).send({
							status:"error",
							code:"500",
							message:"Sorry error in sending welcome mail",
						});
					}
				}	
			});
		}
	} catch (err) {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Soory error in signup",
		});
	}
};

// singin 
const signin = async(req, res, next) => {
	User.findOne({
		email: req.body.email
	}, {"ETHPrivKey":0,_id:0}, function(err, user) {
		if (err) throw err;
		if (!user) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Authentication failed. User not found",
			});
			
		}
		if(user.gmailSignin == false){
			// check if password matches
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					// if user is found and password is right create a token
					var token = jwt.sign(user.toObject(), config.SECRET);
					// return the information including token as JSON
					return res.status(200).send({
						status:"success",
						code:"200",
						token: 'JWT ' + token,
						message:"JWT token created successfully",
					});
				} else {
					return res.status(500).send({
						status:"error",
						code:"500",
						message:"Authentication failed. Wrong password",
					});
				}
			});
		}else {
			return res.status(501).send({
				status:"loginError",
				code:"500",
				message:"Please signIn with Gmail API",
			});
		}
	});
};

// login and signup with gmail api
const loginWithGoogle = async(req,  res, next) => {
	if (!req.body.email) {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Please pass your emailID",
		});
	} else {
		var getUser = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
		if(getUser){
			var token = await jwt.sign(getUser.toObject(), config.SECRET);
			return res.status(200).send({
				status:"success",
				code:"200",
				message:"Successful getting user profile",
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
					return res.status(500).send({
						status:"error",
						code:"500",
						message:"Error in saving user profile",
					});
				} else {
					var result = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
					if(result){
						var token = await jwt.sign(result.toObject(), config.SECRET);
						return res.status(200).send({
							status:"success",
							code:"200",
							message:"Successful getting user profile",
							token: 'JWT ' + token,
						});
					}
				}
			});
		}
	}
};

// login and signup with Facebook api
const loginWithFacebook = async(req,  res, next) => {
	if (!req.body.email) {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Please pass your facebookID",
		});
	} else {
		var getUser = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
		if(getUser){
			var token = await jwt.sign(getUser.toObject(), config.SECRET);
			return res.status(200).send({
				status:"success",
				code:"200",
				message:"Successful getting user profile",
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
					return res.status(500).send({
						status:"error",
						code:"500",
						message:"Error in storing user details",
					});
				} else {
					var result = await User.findOne({"email": req.body.email.toLowerCase()},{"ETHPrivKey":0,_id:0});
					if(result){
						var token = await jwt.sign(user.toObject(), config.SECRET);
						return res.status(200).send({
							status:"success",
							code:"200",
							message:"Successful getting user profile",
							token: 'JWT ' + token,
						});
					}
				}
			});
		}
	}
};

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
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Success",
			data: result
		});
	}
	catch (err) {
		return res.status(500).send({
			status:"error",
			code:"500",
			message:"Unauthorized",
			data: err
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
			data: result
		});
	}
	catch (err) {
		if(err == "Password Reset link has been expired"){
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"failure",
				data: err
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

