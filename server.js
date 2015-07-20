var express = require('express');
var blog = require('./routes/blog/index');
var photography = require('./routes/photography/index');

var app = express();

app.use( '/blog', blog);
app.use( '/photography', photography);

app.listen(3001);
console.log('app running');