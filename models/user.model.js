var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

var UserImport = module.exports = mongoose.model('UserCollection',UserSchema);

//here on out also including all the functions that will be exported out
//because they are all related to database, be it querying or encrypting/
//encoding password


module.exports.addUser = function(newUser, cb){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(cb);

        });
    });
}

//var urlImport=require('../url.model');

//var url_data ={
//        APIIndexPage: "error",
//        URL: "error"
//      };
//    }
//  var urlx = new urlImport(url_data);
//  urlx.save(function(error,data){
//    if(error){
//      res.json(error);
//    } else {
//      res.render('user', data);
//    }
//  });
//an example of mongoose schema '.save(cb)' for reference


module.exports.getUserByUsername = function(username,cb){
    var query = {username: username};
    UserImport.findOne(query, cb);
}
//copied from mongoose documentation for example
// find each person with a last name matching 'Ghost'<--[this is the query], selecting the `name` and `occupation` fields
//Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//  if (err) return handleError(err);
//  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
//})

module.exports.comparePassword = function(clientPwrd, dbPwrd ,cb){
    bcrypt.compare(clientPwrd, dbPwrd, cb);
}
//From bcryptjs npm page documentation
//To check a password:
// Load hash from your password DB. 
//bcrypt.compare("B4c0/\/", hash, function(err, res) {
    // res === true 
//});







