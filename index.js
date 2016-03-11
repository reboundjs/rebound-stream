var fs            = require('fs');
var path          = require('path');
var rebound       = require('reboundjs');
var colors        = require('colors');
var hash          = require('murmurhash');
var walk          = require('walk');


module.exports = function(root){

  var CACHE = {},
      COOKIE = '',
      CACHE_BUSTER = new Date().getTime();

  function isComponent(file){
    return path.extname(file) === '.js';
  }

  function formatPath(req){
    var file = path.parse(req.path);
    file.ext = '.html';
    file.dir = path.join(root, file.dir);
    file.base = file.base.replace(path.extname(req.path), '.html');
    return path.format(file);
  }

  function addToCache(root, stat, next) {

    var file = path.resolve(root, stat.name);

    // If this file is not a component, move on
    if(path.extname(file) !== '.html') return next();
    // Ensure file exists
    if(!stat.isFile()){ return console.error(('No module ' + file + ' found.').red.bold); }

    fs.readFile(file, 'utf8', function(err, src){

      // If an error occured, print it
      if(err) return console.error(('Error reading module: ' + file).red.bold);

      // Compile our component
      src = rebound(src, {standalone: true});

      // Insert the component into the cache
      if(src) CACHE[file] = src;

      next();
    });
  }


  function errorsHandler(root, stats, next) {
    stats.forEach(function (stat) {
      console.error(("Error loading module " + path.resolve(root, stat.name)).red.bold)
      console.error((' - ' + stat.error.message).red.bold);
    });
    next();
  }

  var walker = walk.walk(root, { followLinks: false });
  walker.on("file", addToCache);
  walker.on("errors", errorsHandler);
  walker.on("end", function(){});

  return function(req, res, next){

    // If we are not requesting a JavaScript file in the modules directory, pass through.
    if(!isComponent) return next();

    // console.log('COOKIE:', req.cookies.rebound)

    res.cookie('rebound', '11111111');

    // Reformat request path to find file on disk.
    var file = formatPath(req);

    // If this module is in our cache, return it
    if(CACHE[file]){
      console.log('Fetching from cache'.green.bold);
      console.log(CACHE[file].deps)
      return res.send(CACHE[file].src);
    } else {
      console.log(('Module ' + file + ' not found.').red.bold);
    }
  };
}