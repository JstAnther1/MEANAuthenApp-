var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var config = require('../config/secret');

router.post('/register', function(req,res,next){
    let newUser = new User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    });
    User.addUser(newUser,function(err, user){
        if(err){
            res.json({success: false, message:"Failed to register."});
        } else {
            res.json({success: true, message:"Successfully registered."});
        }
        
    });
});

router.post('/authenticate',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByUsername(username, function(err,user){
        if(err){
            throw err;
        } else if(!user) {
            res.json({success:false,message:'No such user registered.'});
        }
    
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err){
                throw error;
            } else if(isMatch){
                var token = jwt.sign(user,config.secret,{expiresIn:'7d'});
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        dbid:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email
                    }
                });
            } else {
                res.json({success:false,message:'Wrong password.'});
            }
        });
    //please remember that the user used in 'user.password' is in the arguments, user
    //is gotten from the previous function where 'user' is the entry in database of
    //all the details of the user 

    //from npm jsonwebtoken example  of generating token
    //jwt.sign({
    //  data: 'foobar'
    //}, 'secret', { expiresIn: '1h' });

    //REMEMBER!!! the psssport-jwt strategy fromAuthHeader() NEEDS to find a token header 
    //that reads 'JWT '+token. IMPORTANT is the 'jwt and space' plus token
    });
});

router.get('/profile',passport.authenticate('jwt', {session:false}),function(req,res,next){
    res.json(req.user);
});
//after authenticating through passport strategy using the json webtoken, through function
//getUserByUsername, in the callback function(err, user), 'user' holds the userdata

module.exports = router;