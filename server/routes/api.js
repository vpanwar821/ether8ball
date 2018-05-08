var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var services = require('../services/apiServices.js');

// signup

const createGene = async(req,res,next) => {
  try{
      var gene = req.body.gene; 
      let result = await cueGene(gene);
  }
  catch(err){
      logger.error(err);
  }
}

const singup = async(req,  res, next) => {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      phoneNo: req.body.phoneNo,
      firstName: req.body.firstName,
      lastName:  req.body.lastName
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Email already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
};

// singin 
const signin = async(req,  res, next) => {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};


// updateUserProfile with email id
const updateProfile = async(req,  res, next) => {
  passport.authenticate('jwt', { session: false}), async(req, res) =>{
    var token = getToken(req.headers);
    if (token) {
      myquery = {email:req.body.email};
      myvalues = {$set:{ firstName: req.body.firstName, lastName: req.body.lastName, gender: req.body.gender, phoneNo:req.body.phoneNo}};
      var doo = await User.update(myquery,myvalues);
      res.json({success: true, msg: 'Successful updated user profile.'});
                      
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  };
}

const getUsers= async(req,  res, next) => {
  passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      User.find(function (err, result) {
        if (err) return next(err);
        res.json(result);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  };
};


// get User Profile
const getUser= async(req,  res, next) => {
  passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      User.findOne({"email": req.get('email')},function (err, result) {
        if (err) return next(err);
        res.json(result);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  };
};



// forgot password
const forgotPassword= async(req, res, next) => {
  var email =  req.get('email'); 
  try{
      let result = await services.forgotPassword(email);
      res.status(200).send({"message": "success", "data" : result});        
  }
  catch (err) {
    res.status(500).send({"message": "failure", "data" : err});
  }
};

// set forgotPassword 
const forgotPasswordSet= async(req, res, next) => {
  var email =  req.body.email;
  var token = req.body.token;
  var password = req.body.password;
  try{
    let result = await services.setForgotPassword(token, password);
    res.status(200).send({"message": "success", "data" : result});        
  }
  catch (err) {
    if(err == "Password Reset link has been expired"){
      res.status(403).send({"message": "failure", "data" : err});  
    }
    else{
    res.status(500).send({"message": "failure", "data" : err});
    }
  }
};


// set resetPassword 
const resetPassword= async(req,  res, next) => {
  passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    var email =  req.body.email;
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    
    if(token){
      try{
          let result = await services.setResetPassword(email, oldPassword, password);
          res.status(200).send({"message": "success", "data" : result});        
        }
      catch (err) {
        res.status(500).send({"message": "failure", "data" : err});
      }
    } else {
      return res.status(403).send({"message": false, msg: 'Unauthorized.'});
    }
  }
};


module.exports = function(router){
  
  router.post('/signup',
      (req,res,next) => {
          next();            
      },
      singup
  );

  router.post('/signin',
      (req,res,next) => {
          next();            
      },
      signin
  );

  router.post('/updateProfile',
      (req,res,next) => {
          next();            
      },
      updateProfile
  );

  router.get('/getUsers',
      (req,res,next) => {
          next();            
      },
      getUsers
  );

  router.get('/getUser',
      (req,res,next) => {
          next();            
      },
      getUser
  );

  router.get('/forgotPassword',
      (req,res,next) => {
          next();            
      },
      forgotPassword
  );

  router.post('/setForgotPassword',
      (req,res,next) => {
          next();            
      },
      forgotPasswordSet
  );

  router.post('/resetPassword',
      (req,res,next) => {
          next();            
      },
      resetPassword
  );
}

