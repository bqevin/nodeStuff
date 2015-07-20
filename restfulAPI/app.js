var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var restful = require('node-restful');
restful.mongoose;
//Data Schema
var apiSchema = new mongoose.Schema({
	name: String,
	age : Number,
	gender: String
});
// Connect to cloud database
var url = '';
mongoose.connect(url);
var app = express();

//Configuring node-restful
var ApiModel = restful.model('apiModel', apiSchema);
ApiModel.methods(['get','post','put','delete']);
ApiModel.register(app,'/api');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

