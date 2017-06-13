(function TokensearchModule(global) {
'use strict';
/*
 * tokensearch.js: simple string token collection search
 *
 * (C) 2015 Michael Vogt
 * MIT LICENSE
 *
 */
 var Tokensearch = function(_collection, options) {
  if (!_collection || _collection.length===0) {
    throw new Error('Empty collection!');
  }
  this.collection = [];
  _collection.forEach(entry => {
    this.collection.push({ 'item': entry });
  });
  options = options || {};
  this.delimiter = options.delimiter || Tokensearch.defaultOptions.delimiter;
  this.unique = options.unique || Tokensearch.defaultOptions.unique;
  this.maxFilterTokenEntries = options.maxFilterTokenEntries || Tokensearch.defaultOptions.maxFilterTokenEntries;
  this.defaultThreshold = options.threshold || Tokensearch.defaultOptions.threshold;
  this.collectionKeys = options.collectionKeys || Tokensearch.defaultOptions.collectionKeys;
  this.searchAlgorithm = options.searchAlgorithm || Tokensearch.defaultOptions.searchAlgorithm;
  this.sortAlgorithm = options.sortAlgorithm || Tokensearch.defaultOptions.sortAlgorithm;
  this.postprocessAlgorithm = options.postprocessAlgorithm || Tokensearch.defaultOptions.postprocessAlgorithm;
  if (this.collectionKeys.length===0) {
    throw new Error('No collectionKeys defined!');
  }
  this.collectionDataTokenSize = this.collectionKeys.length;
  this._prepareSearchTokens();
};

Tokensearch.defaultOptions = {
  //split strings with a delimiters, can be a regex or a character
  delimiter: /[\s-_]+/,

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKeys: [],

  //the result just contains unique results (based on collection keys)
  unique: false,

  //used to pre-verify an entry
  preprocessCheck: function() {
    return true;
  },

  // search all 'needles' in the 'haystack', return a score for each function call
  searchAlgorithm: function(haystack, needles) {
    var score = 0;
    var arrayLength = needles.length;
    for (var i = 0; i < arrayLength; i++) {
      var needle = needles[i];
      var stringPos = haystack.indexOf(needle);
      if (stringPos > -1) {
        if (needle.length < 2) {
          score += 1;
        } else {
          if (haystack === needle) {
            score += 6;
          } else if (stringPos === 0) {
            score += 2;
          } else {
            score += 1;
          }
        }
      }
    }
    return score;
  },

  //postprocess all elements (=contains all elements with a score)
  postprocessAlgorithm: function(collection, maxScore, threshold) {
    var normalizedScore = 1 / maxScore;
    var result = [];
    var ids = [];
    collection.forEach(e => {
      e.score = 1-e.score*normalizedScore;
      if (e.score <= threshold) {
        e.maxScore = maxScore;
        let id = '';
        this.collectionKeys.forEach(key => {
          id += '' + e.item[key];
        });

        if (this.unique) {
          if (ids.indexOf(id) === -1) {
            ids.push(id);
            result.push(e);
          }
        } else {
          result.push(e);
        }
      }
    });
    return result;
  },

  // sort the result array (=output of the postprocess step)
  sortAlgorithm: function(array) {
    return array.sort(function(a, b) {
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      if (a.item) {
        return a.item.name.localeCompare(b.item.name);
      }
      return 0;
    });
  }
};

Tokensearch.prototype._prepareSearchTokens = function() {
  //Get all search tokens
  this.collection.forEach(entry => {
    var tmp = [];
    this.collectionKeys.forEach(key => {
      entry.item[key].trim().toLowerCase().split(this.delimiter).forEach(function(e) {
        tmp = tmp.concat(e);
      });
    });
    entry.dataEntryTokens = tmp.filter(this._onlyUnique);
  });
};

Tokensearch.prototype._onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
};

/**
 * returns an sorted array of { 'item': OBJECT, 'score': score }
 * -item contains the input object
 * -score defines the match with the search term, 0 means perfect match, 1 means rubbish
 */
Tokensearch.prototype.search = function(token, options) {
  options = options || {};

  var searchTokens = [];
  var threshold = options.customThreshold || this.defaultThreshold;
  var preprocessCheck = options.preprocessCheck || Tokensearch.defaultOptions.preprocessCheck;

  //make sure the search tokens contains no dups
  var tmp = token.trim().split(this.delimiter).filter(this._onlyUnique);
  for (var i = 0, len = Math.min(tmp.length, this.maxFilterTokenEntries); i < len; i++) {
    searchTokens.push(tmp[i].toLowerCase());
  }

  var resultTmp = [];
  var maxScore = 0;
  this.collection.forEach(entry => {
    if (preprocessCheck && !preprocessCheck(entry.item)) {
      return;
    }

    var score = 0;
    entry.dataEntryTokens.forEach(dataEntryToken => {
      score += this.searchAlgorithm(dataEntryToken, searchTokens);
    });

    if (score) {
      if (score > maxScore) {
        maxScore = score;
      }
      resultTmp.push({ 'item': entry.item, 'score': score });
    }
  });

  var result = this.postprocessAlgorithm(resultTmp, maxScore, threshold);
  return this.sortAlgorithm(result);
};

/**
 * search for a custom entry
 */
Tokensearch.prototype.findFirstExactMatch = function(cb) {
  if (typeof cb !== 'function') {
    return;
  }
  for (var i=0, len=this.collection.length; i < len; i++) {
    var entry = this.collection[i];
    if (cb(entry.item)) {
      return entry.item;
    }
  }
};



  // Export to Common JS Loader
  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Tokensearch;
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Tokensearch;
    });
  } else {
    // Browser globals (root is window)
    global.Tokensearch = Tokensearch;
  }

//inject (optional) window object into the IIFE function
})(this);
