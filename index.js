var PORT = process.env.PORT || 9999;

var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var app = express()
var colors = require('x11-color-names');
var colorsByName = _(colors).indexBy('name');
var colorsByCategory = _(colors).groupBy('category');

app.use(express.logger());
app.use(express.bodyParser());

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

app.get('/colors', function(req, res) {
  if(req.query.category) {
    if(colorsByCategory[req.query.category]) {
      res.send(colorsByCategory[req.query.category]);
    } else {
      res.send(404);
    }
  } else {
    res.send(colors);
  }
});

app.get('/colors/:name', function(req, res) {
  if(colorsByName[req.params.name]) {
    res.send(colorsByName[req.params.name]);
  } else {
    res.send(404);
  }
});

app.post('/colors/:name', function(req, res) {
  console.log(req.body);
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
  console.log("Serer started on port " + PORT);
});
