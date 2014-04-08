var PORT = process.env.PORT || 9999;

var express = require('express');
var fs = require('fs');
var app = express()

app.use(express.logger());

app.get(/^\/ex3\//, function(req, res) {
  fs.readFile(__dirname + '/public/awesome-sauce-3.html', {encoding: 'utf8'}, function(err, file) {
    res.send(file);
  });
});

app.get(/^\/ex3f\//, function(req, res) {
  fs.readFile(__dirname + '/public/awesome-sauce-3-fixed.html', {encoding: 'utf8'}, function(err, file) {
    res.send(file);
  });
});

app.get(/^\/ex3ff\//, function(req, res) {
  fs.readFile(__dirname + '/public/awesome-sauce-3-fixed-2.html', {encoding: 'utf8'}, function(err, file) {
    res.send(file);
  });
});


app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
  console.log("Serer started on port " + PORT);
});
