// We're working with numbers too large for vanilla JavaScript!
var BigInt = require('decimal.js');
var fs = require('fs');

BigInt.config({
  precision: 1000000000,
  errors: false
})

const UPPER = 10000,
      CACHE = {};

for(var i=0;i<=UPPER; i++){
  CACHE[i] = BigInt(2).pow(i).toJSON();
  console.log(i);
}

var OUT = JSON.stringify(CACHE, null, 4);

fs.writeFile('cache.json', OUT);
