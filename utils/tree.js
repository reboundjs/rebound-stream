// We're working with numbers too large for vanilla JavaScript!
var BigInt = require('decimal.js');
var POWS = require('../cache.json');

BigInt.config({
  precision: 100000,
  errors: false
})

// Cache is a binary tree where levels in the tree corrospond to Component IDs (CIDs),
// and Left and Right values respectively corrospond to Not Loaded and Loaded states.
// Because of the mathmatical properties of binary trees, we don't actually need
// to store the complete binary tree in memory, just the current state's Node ID (NIDs)
// as calculated here:
//
// CID                            NID
// ------------------------------------------------------------
//  0 |                            0
//  1 |              1                           2
//  2 |       3             4             5             6
//  3 |   7      8      9      10     11     12     13     14
//  4 | 15 16  17 18  19 20  21 22  23 24  25 26  27 28  29 30

// CID                            NID
// ------------------------------------------------------------
//  0 |                            0
//  1 |              0                           1
//  2 |       0             1             2             3
//  3 |   0      1      2      3       4     5       6     7
//  4 | 0   1   2 3    4 5    6 7     8 9  10 11   12 13 14 15

function Cache(seed){

  // Create internal caches
  this.level = {};
  this.groups = {};

  seed = seed.split('&');

  var level = BigInt.fromJSON(seed[0]);

  // Find the level that this node resides in and compute metadata for current depth
  this.load(level);

  // Save the current selected node
  // Hot load with a specific state, or default to empty
  this.nid = this.level.count.sub(1).add(BigInt.fromJSON((seed[1] || '0')));

  // Clean up any falsy leaf nodes at the bottom of our tree
  this.prune();

}

Cache.prototype.toString = function toString(){
  return this.level.cid.toJSON() + '&' + this.nid.sub(this.level.count.sub(1)).toJSON();
};

Cache.prototype.load = function load(cid){

  // If the cache already contains info for this cid, don't evaluate again
  if(this.level.cid && this.level.cid.eq(cid)){ return; }

  // Save our level ID
  this.level.cid = cid;

  // Compute the number of nodes in this level
  this.level.count = BigInt.fromJSON(POWS[cid.toString()]);

  // Given the level, get the max and min NIDs for this level
  // Uses the formula for the number of nodes in a binary tree
  this.level.max = BigInt.fromJSON(POWS[this.level.cid.plus(1).toString()]).minus(2);
  this.level.min = this.level.max.minus(this.level.count).plus(1);
}


// Loads the stats for a given cid, level of the tree, and cache it so we only
// have to compute these once. Saves information in this.groups for use in other
// convenience functions
Cache.prototype.group = function(cid){

    // If the stage already contains info for this this basis cid, don't evaluate again
    if(this.groups.cid && this.groups.cid.eq(cid)){ return; }

    // Cache our group basis cid
    this.groups.cid = cid;

    // First, get the number of leaves in the requested Component's row
    this.groups.count = BigInt.fromJSON(POWS[cid.toString()]);

    // Get the grouping size of our current level
    this.groups.size = this.level.count.div(this.groups.count);

}

// Removes all falsy leaf nodes at the bottom of our tree. The level of our NID
// should only be as high as our highest registered CID.
Cache.prototype.prune = function prune(){
  // TODO: Clean up all falsy leaf nodes at the end of our tree
}

// If the group number is even (left sided), this component has not been loaded yet
// If the group number is odd (right sided), this component has been loaded
// Cast as a boolean and return
Cache.prototype.contains = function contains(cid){
  if(cid.constructor !== BigInt){
    cid = (typeof cid == 'number') ? new BigInt(cid) : BigInt.fromJSON(cid);
  }

  // If the requested level is larger then the highest loaded level, return false
  if(cid.gt(this.level.cid)){ return false; }

  // Load this level's group metadata
  this.group(cid);

  // Get the zero-based index of our current NID in its row
  var index = this.nid.minus(this.level.min);

  // And calculate the zero-based group number that our current NID falls in.
  var group = index.div(this.groups.size).floor();

  return Boolean(group.mod(2).toNumber());
}

Cache.prototype.add = function add(cid){

  cid = new BigInt(cid);

  // Else If our cache already contains this CID, return
  if(this.contains(cid)){ return true; }

  // If cid is an ancestor of our current node, set its level from false to true
  if(this.level.cid.gte(cid)){

    // Set its new value by adding one group size to our current NID, effectively
    // switching left to right on the level we are adding
    this.group(cid);
    this.nid = this.nid.plus(this.groups.size);

  }

  // If cid is yet-to-be-computed child of our current node, compute it.
  // All intermediate levels are set to falsy values
  else {

    // Get the zero-based index of our current NID in its row. This is the group
    // number of our new NID.
    var group = this.nid.minus(this.level.min);

    // Get the size of each grouping on this new level
    var groupSize = BigInt.fromJSON(POWS[cid.toString()]).div(this.level.count);

    // Load the new CID's level info
    this.load(cid);

    // New NID is the second node in the group specified by our old NID
    this.nid = groupSize.times(group).plus(this.level.min).plus(1);
  }

}

Cache.prototype.remove = function remove(cid){

  cid = new BigInt(cid);

  // Get grouping info from the level we are adding
  this.group(cid);

  // If our cache does not already contain this CID, return
  if(!this.contains(cid)){ return true; }

  // Remove one "group size" from our NID, effectively switching right to left
  // on the level we are removing.
  this.nid = this.nid.minus(this.groups.size);

  // Clean up all falsy leaf nodes at the bottom of our tree
  this.prune();
}

module.exports = Cache;