//Having all the dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Declaring Database Schema
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema(
		{
			id:ObjectId,
			name: String,
			age : Number,
			gender : String
		}
));

//Connecting the mongoose database
mongoose.connect('mongodb://localhost/rest_api');

var app =express();

//ALL CONFIGURATIONS
//Set the view engine
app.set('view engine', 'ejs');
//Have the HTML in the view source
app.locals.pretty = true;
//set body parser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());





app.get('/', function(req, res){
  res.render('index',{title:"Users Registrar", shida: ""});
});

app.post('/regist', function(req, res){
	var newUser = new User({
		name : req.body.name,
		age : req.body.age,
		gender : req.body.gender
	});
//Saving the new created user
	newUser.save(function(err){
		if (err) {
			res.render('index', 
				{ shida :"The information couldn't be saved"
			});
		} else {
			res.send("information Saved!");
		}
	});
});

//Displaying All registed Users
app.post('/display', function(req, res){
		User.find(function(err, user){
			if (!user) {
				res.render('dashboard',{
					title: ' Kevin MongoDB Users',
					shida: 'No Users Registered',
					user: 'Blank'
				});
			} else {
				res.render('dashboard',{
					title: ' Kevin MongoDB Users',
					shida: '',
					user: user
				});
			}
		})
	});
//Declaring the listening port 
var port = process.env.PORT || '2000';

app.listen(port, function(){
	console.log('listening on port: '+port);
})