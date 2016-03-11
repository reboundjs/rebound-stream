var http            = require('http');
var path            = require('path');
var express         = require('express');
var stream          = require('../index.js');

var app = express();

// Set Static Content Locations
  app.use(express.static(__dirname));

// Our New Fancy Middleware
  app.use('/reset', function(req, res){
    console.log('RESET')
  });
  app.use('/modules', stream(__dirname + '/modules'));

// Start Server
  http.createServer(app).listen(2345, function(){
    console.log('Express server listening on port ' + app.get('port'));
    // If user id and group id are set, force process to run with those permissions
    if(process.env.GID && process.env.UID){
      process.setgid(process.env.GID);
      process.setuid(process.env.UID);
    }
  });