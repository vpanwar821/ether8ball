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
import { getEtherAddress } from '../services/ethereumService';
// var getEtherAdd = require('./ether');

const signup = async(req,res, next) => {
		
	if (!req.body.email || !req.body.password) {
		return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
	} else {
		var newUser = new User({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
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
				var genratingAddress = await getEtherAddress(req.body.email);
				return res.status(200).send({
					status:"success",
					code:"200",
					message:"Successful created new user",
					publicKey: genratingAddress
				});
			}
			
		});
	}
};

// singin 
const signin = async(req,	res, next) => {
	
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
			
		} else {
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
	  var newUser = new User();
	  newUser.id = req.body.id;
	  newUser.token = req.body.idToken;
	  newUser.name = req.body.name;
	  newUser.email = req.body.email;
	  // save the user
	  newUser.save(function(err) {
		if (err) {
			return res.status(500).send({
				status:"error",
				code:"500",
				message:"Email already exists",
			});
		} else {
			User.findOne({"email": req.body.email},{"ETHPrivKey":0,_id:0},function (err, result) {
				if (err) return next(err);
				return res.status(200).send({
					status:"success",
					code:"200",
					message:"Successful getting user profile",
					data: result
				});
			});
		}
		return res.status(200).send({
			status:"success",
			code:"200",
			message:"Successful created new user",
		});
	  });
	}
};
// updateUserProfile with email id
const updateProfile = async(req,res, next) => {
	
	var token = getToken(req.headers);
	
	if (token) {
		myquery = {email:req.body.email};
		myvalues = {$set:{ name: req.body.name, gender: req.body.gender, phoneNo:req.body.phoneNo}};
		var doo = await User.update(myquery,myvalues);
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
const getUserProfile= async(req,	res, next) => {
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
	var email =	req.body.email;
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
	
	router.post('/signup', (req,res,next) => {
			next();						
		},
		signup
	);

	router.post('/signin', (req,res,next) => {
			next();						
		},
		signin
	);

	router.post('/saveGoogleData',
		(req,res,next) => {
			next();            
		},
		loginWithGoogle
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

