var PORT = process.env.PORT || 9999;

var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var app = express()
var colors = require('x11-color-names');
var colorsByName = _(colors).indexBy(function(color) { return color.name.toLowerCase(); }).value();
var colorsByCategory = _(colors).groupBy(function(color) { return color.category.toLowerCase(); }).value();

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
    category = req.query.category.toLowerCase();
    if(colorsByCategory[category]) {
      res.send(colorsByCategory[category]);
    } else {
      res.send(404);
    }
  } else {
    res.send(colors);
  }
});

app.get('/colors/:name', function(req, res) {
  colorName = req.params.name.toLowerCase()
  if(colorsByName[colorName]) {
    res.send(colorsByName[colorName]);
  } else {
    res.send(404);
  }
});

app.post('/colors/:name', function(req, res) {
  console.log(req.body);
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
