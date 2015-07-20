var https = require('https');
var fs = require('fs');
var express = require('express');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app =  express();

//Using SSL Authentication
//Logs the Cert and Key file values
var server = https.createServer({
	cert:fs.readFileSync(__dirname+'/my.crt'),
	key:fs.readFileSync(__dirname+'/my.key')
},app);

//Set  view engine
app.set('view engine', 'ejs');

//Register Middlewares
app.use(bodyParser.urlencoded({extended:true}));

//Cookie Parsing and express session can be commented out since I don't require sessions in Basic Authentication
app.use(cookieParser());
app.use(expressSession({
	secret : process.env.SESSION_SECRET || 'secret',
	resave : false,
	saveUninitialized : false
	})
);

app.use(passport.initialize());

//Since I don't need my session variable, can comment these lines
app.use(passport.session());
passport.use(new passportLocal.Strategy(verifyCredintials));

//Configuring using Http Basic Strategy....Digest is more secure though  
passport.use(new passportHttp.BasicStrategy(verifyCredintials));

//Checks if the input data are available (can inject data from your DB here)
function verifyCredintials(username, password, done){
	//Here you query DB
	if (username === password) {
			done(null, {id: username, name: username});
	} else {
			done(null, null);
	}
		//done(new Error('Ouch, my Bad'));
}

passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	//Can initialize the database here to confirm ID
	done(null, {id:id, name: id });
});

//Custom Middleware to ensure the user using our APIS are authenticated
function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) {
		next();
	} else {
		res.send(403);
		//res.redirect('/login');
	}
}

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
	req.logout();
	res.redirect('/');
});


//Specifying the use of Basic Strategy in entire /api directory
//Basic authentication constantly ensures a valid authentication before proceeding
//to prove the above said i have disabled session variable by passing a false option as a scope inside authenticate() method
app.use('/api', passport.authenticate('basic', {session:false}));

//API Endpoints
app.get('/api/data', ensureAuthenticated,  function(req, res){
	res.json([
	{value: 'foo'},
	{value: 'bar'},
	{value: 'baz'}
	]);
});

app.post('/login', passport.authenticate('local'), function(req, res){
//You can use scopes  (successRedirect and fialureRedirect with autnenticate())
res.redirect('/');
});
// app.post('/login', function(req, res){
//  var user = req.body.username;
//  var pass = req.body.password;
//  res.send('welcome '+user + '!');
// });

//Port Listen Set-Up
var port = process.env.PORT || 1337;

server.listen(port, function(){
	console.log('https://127.0.0.1:'+port+'/api/data');
});