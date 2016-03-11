var fs        = require('fs');
var path        = require('path');
var WorkQueue = require('mule').WorkQueue;

var workQueue = new WorkQueue(__dirname + '/worker.js');

// Generate a series of 2^n numbers using the work queue to avoid blocking.
const ITER = 1000000;
const CACHE = {};

var waiting = 0;
for (var i = 0; i <= ITER; i++) {

  (function(i){

    if(i % 3 !== 0){ return; }

    waiting++;

    workQueue.enqueue(i, function (result) {

      CACHE[i] = result;

      console.log('Done:', i, waiting);

      if(--waiting % 1000 === 0){
        console.log("10,000! Saving data...")
        fs.writeFile(path.join(__dirname, 'cache.json'), JSON.stringify(CACHE, null, 4));
      }

      if (waiting === 0) {
          // All jobs are complete so we can safely exit
          console.log('Done! Saving...')
          fs.writeFile(path.join(__dirname, 'cache.json'), JSON.stringify(CACHE, null, 4), function(){
            console.log('Saved!')
            process.exit(0);
          });
      }
    });

  })(i);

}

console.log('See, no blocking!');