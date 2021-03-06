var express = require('express');
var app =  express();
var passport = require('passport');
var passportLocal = require('passport-local');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//Set  view engine
app.set('view engine', 'ejs');

//Register Middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(expressSession({
	secret : process.env.SESSION_SECRET || 'secret',
	resave : false,
	saveUninitialized : false
	})
);
app.use(passport.initialise());
app.use(passport.session());
passport.use(new passportLocal.Strategy(function(username, password, done){
	//Here you query DB
	if (username === password) {
			done(null, {id: username, name: username});
	} else {
			done(null, null);
	}
		//done(new Error('Ouch, my Bad'));
	}));
passport.serializeUser(function(user, done){
	done(null, user.id);
});
password.deserializeUser(function(id, done){
	//Can initialize the database here to confirm ID
	done(null, {id:id, name: id });
});
//Listen on renders
app.get('/', function(req, res){
 res.render('index',{
 		isAuthenticated: req.isAuthenticated(),
 		user:req.user
 });
});

app.get('/login', function(req, res){
	res.render('login');
});
app.get('/logout', function(req, res){
	res.logout();
	res.redirect('/');
});

app.post('/login', passport.authenticate('local'), function(req, res){
res.redirect('/');
});
// app.post('/login', function(req, res){
//  var user = req.body.username;
//  var pass = req.body.password;
//  res.send('welcome '+user + '!');
// });

//Port Listen Set-Up
var port = process.env.PORT || 1337;

app.listen(port, function(){
	console.log('http://127.0.0.1:'+port+'/');
});