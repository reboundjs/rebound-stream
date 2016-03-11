var Cache = require('../utils/tree.js');
var POWS = require('../cache.json');
var BigInt = require('decimal.js');
BigInt.config({
  precision: 1000000,
  errors: false
})

function test(num){

  var t1, t2, res, cache;
  t1 = process.hrtime();
  cache = new Cache(num);
  t2 = process.hrtime(t1);
  console.log('Initialized in', t2[1]/1000000 + 'ms\nLevel:', cache.level.cid.toString(), '\nLeaf Nodes:')
  // console.log('NID:', cache.nid.toString());

  t1 = process.hrtime();
  res = cache.contains(1);
  t2 = process.hrtime(t1);
  console.log('CID 1 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(2);
  t2 = process.hrtime(t1);
  console.log('CID 2 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(3);
  t2 = process.hrtime(t1);
  console.log('CID 3 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(4);
  t2 = process.hrtime(t1);
  console.log('CID 4 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(60);
  t2 = process.hrtime(t1);
  console.log('CID 60 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(1660);
  t2 = process.hrtime(t1);
  console.log('CID 1660 Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = cache.contains(level);
  t2 = process.hrtime(t1);
  console.log('CID', level, 'Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  t1 = process.hrtime();
  res = true;

  // for(var i = 1; i<=level; i++){
  //   res = res && cache.contains(i);
  //   if(!res){ break; }
  // }
  // t2 = process.hrtime(t1);
  // console.log('ALL LEVELS UP TO', --i, 'Status: ',res, '(' + t2[1]/1000000 + 'ms)')

  return;

  t1 = process.hrtime();
  res = cache.add(2);
  t2 = process.hrtime(t1);
  console.log('Adding 2: ',res, '(' + t2[1]/1000000 + 'ms)')


  t1 = process.hrtime();
  res = cache.contains(2);
  t2 = process.hrtime(t1);
  console.log('CID 2 Status: ',res, '(' + t2[1]/1000000 + 'ms)')


  t1 = process.hrtime();
  res = cache.remove(1);
  t2 = process.hrtime(t1);
  console.log('Removing 1: ',res, '(' + t2[1]/1000000 + 'ms)')


  t1 = process.hrtime();
  res = cache.contains(1);
  t2 = process.hrtime(t1);
  console.log('CID 1 Status: ',res, '(' + t2[1]/1000000 + 'ms)')


  t1 = process.hrtime();
  res = cache.toString();
  t2 = process.hrtime(t1);
  console.log('Value -', t2[1]/1000000 + 'ms', res);
  console.log('Using', Buffer.byteLength(res, 'utf8') + '/4096 bytes', '\n\n');

}

var level = 9998;
test(new BigInt(level).toJSON() + '&' + BigInt.fromJSON(POWS[(level)]).sub(1).toJSON());

// test('p');
// test('i');
// test('03UPeQYhcHT');
// test('0aTnOXC~A}JmIXi(v:I|}Lo`0BS1E%wBAxlCWcuX.Q39{1zv-?h-3yJ848B;HQVV]Xy;QS^zZF.3%;*nEj/kBx-Uz.j|Ji99+~ipr[1GE[tMJ=_WPt9F4g,e%](9?3[LoKqSSe;R~xwrQbpF@EJ$H4}tky7n#D+-');
// test(new BigInt(2).pow(1024).sub(1).mul(2).toJSON())


