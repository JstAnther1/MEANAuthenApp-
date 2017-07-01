var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/travlogindb');

mongoose.connection.on('connected', function(){
    console.log('connected to db:travlogindb');
});

mongoose.connection.on('error', function(err){
    console.log('error connecting ');
});

var app = express();

var index = require('./routes/index');
var users = require('./routes/user');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration


//-----------------------
app.use('/', index);
app.use('/users', users);
//----------------------
//REMEMBER!!! ALWAYS PUT THIS BLOCK AFFFFTTERRRR the rest of using the 
//"app.use(.....)"  of the modules that are going to be used

app.listen(port, function(){
    console.log('server started on port 3000');
});

module.exports = app;