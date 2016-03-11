// We're working with numbers too large for vanilla JavaScript!
var BigInt = require('decimal.js');

BigInt.config({
  precision: 1000000000,
  errors: false
})

// This is where we accept tasks given to us from the parent process.
process.on('message', function (message) {

    // Do some CPU intensive calculations with the number passed.
    var result = BigInt(2).pow(message).toJSON();

    // Send the result back to the parent process when done.
    process.send(result);
});

/* Send ready signal so parent knows we're ready to accept tasks. This should
 * always be the last line of your worker process script. */
process.send('READY');