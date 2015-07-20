var express =  require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//Configure app
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser());
//Use middleware

//Define routes
var toDO = [
		{id:1, desc:'foo'}, 
		{id:2, desc:'bar'}, 
		{id:3, desc:'baz'}, 
		{id:4, desc:'sth'}
		]
app.get('/', function(req, res) {
	res.render('index' , {
		title : 'Kevins youDo app',
		items : toDO
	});
});
app.post('/add', function(){
	var add = req.body.newItem;
	toDO.push({
		id:toDO.length+1,
		desc:newItem
	});
});

app.listen(3000, function(){
	console.log('App up!');
});