var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user.model');
var config = require('../config/secret');



module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload,done){    
        console.log(jwt_payload); //to know what the payload looks like
        User.getUserByUsername(jwt_payload._doc.username, function(err, user){
            if(err) {
                return done(err, false);
            }
            if (user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}